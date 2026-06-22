// const pool    = require('../../../config/db');
// const { sendNotification } = require('../../../config/notification');

// exports.send = async ({ title, message, image, target, recipient_ids, sent_by }) => {
//   let fcmTokens = [];

//   if (target === 'all') {
//     const [uTokens] = await pool.query('SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"');
//     const [aTokens] = await pool.query('SELECT fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active"');
//     fcmTokens = [...uTokens, ...aTokens].map((r) => r.fcm_token).filter(Boolean);
//   } else if (target === 'users') {
//     const [rows] = await pool.query('SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"');
//     fcmTokens = rows.map((r) => r.fcm_token).filter(Boolean);
//   } else if (target === 'astrologers') {
//     const [rows] = await pool.query('SELECT fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active"');
//     fcmTokens = rows.map((r) => r.fcm_token).filter(Boolean);
//   } else if (target === 'specific' && recipient_ids?.length) {
//     // recipient_ids = [{ type: 'user'|'astrologer', id }]
//     for (const rec of recipient_ids) {
//       const table = rec.type === 'user' ? 'users' : 'astrologers';
//       const [[row]] = await pool.query(`SELECT fcm_token FROM ${table} WHERE id = ?`, [rec.id]);
//       if (row?.fcm_token) fcmTokens.push(row.fcm_token);
//     }
//   }

//   let sentCount = 0;
//   for (const token of fcmTokens) {
//     try {
//       await sendNotification({ token, title, body: message, image });
//       sentCount++;
//     } catch (_) { /* skip invalid tokens */ }
//   }

//   // Persist
//   await pool.query(
//     'INSERT INTO notifications (title, message, image, target_type, sent_count, sent_by_admin, type) VALUES (?,?,?,?,?,?,?)',
//     [title, message, image || null, target, sentCount, sent_by, 'push']
//   );

//   return sentCount;
// };

// exports.getHistory = async ({ page, limit }) => {
//   const offset = (page - 1) * limit;
//   const [[{ total }]] = await pool.query(
//     'SELECT COUNT(*) AS total FROM notifications WHERE sent_by_admin IS NOT NULL'
//   );
//   const [rows] = await pool.query(`
//     SELECT n.id, n.title, n.message, n.image, n.target_type, n.sent_count,
//       n.type, n.created_at, au.name AS sent_by_name
//     FROM notifications n
//     LEFT JOIN admin_users au ON au.id = n.sent_by_admin
//     WHERE n.sent_by_admin IS NOT NULL
//     ORDER BY n.created_at DESC LIMIT ? OFFSET ?
//   `, [limit, offset]);
//   return { total, data: rows };
// };


const pool = require('../../../config/db');
const { sendNotification } = require('../../../config/notification');

exports.send = async ({ title, message, image, target, recipient_ids, sent_by }) => {
  let fcmTokens = [];

  // helper to push tokens safely
  const addTokens = (rows) => {
    if (!rows?.length) return;
    for (const r of rows) {
      if (r?.fcm_token) fcmTokens.push(r.fcm_token);
    }
  };

  // ALL USERS + ASTROLOGERS
  if (target === 'all') {
    const [uTokens] = await pool.query(
      'SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"'
    );
    const [aTokens] = await pool.query(
      'SELECT fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active"'
    );

    addTokens(uTokens);
    addTokens(aTokens);
  }

  // ONLY USERS
  else if (target === 'users') {
    const [rows] = await pool.query(
      'SELECT fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"'
    );
    addTokens(rows);
  }

  // ONLY ASTROLOGERS
  else if (target === 'astrologers') {
    const [rows] = await pool.query(
      'SELECT fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active"'
    );
    addTokens(rows);
  }

  // SPECIFIC USERS / ASTROLOGERS (FIXED)
  else if ((target === 'specific_user' || target === 'specific_astrologer') && recipient_ids?.length) {
    const grouped = {
      user: [],
      astrologer: []
    };

    // group ids
    for (const rec of recipient_ids) {
      if (rec.type === 'user') grouped.user.push(rec.id);
      else if (rec.type === 'astrologer') grouped.astrologer.push(rec.id);
    }

    // fetch in batch (OPTIMIZED)
    if (grouped.user.length) {
      const [rows] = await pool.query(
        `SELECT fcm_token FROM users WHERE id IN (?)`,
        [grouped.user]
      );
      addTokens(rows);
    }

    if (grouped.astrologer.length) {
      const [rows] = await pool.query(
        `SELECT fcm_token FROM astrologers WHERE id IN (?)`,
        [grouped.astrologer]
      );
      addTokens(rows);
    }
  }

  // REMOVE DUPLICATE TOKENS
  fcmTokens = [...new Set(fcmTokens)];

  // SEND NOTIFICATIONS
  let sentCount = 0;

  for (const token of fcmTokens) {
    try {
      await sendNotification({
        token,
        title,
        body: message,
        image
      });
      sentCount++;
    } catch (err) {
      // ignore invalid tokens
    }
  }

  // SAVE IN DB
  await pool.query(
    `INSERT INTO notifications 
     (title, message, image, target_type, sent_count, sent_by_admin, type)
     VALUES (?,?,?,?,?,?,?)`,
    [
      title,
      message,
      image || null,
      target,
      sentCount,
      sent_by,
      'system'
    ]
  );

  return sentCount;
};

exports.getHistory = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM notifications WHERE sent_by_admin IS NOT NULL'
  );

  const [rows] = await pool.query(`
    SELECT 
      n.id,
      n.title,
      n.message,
      n.image,
      n.target_type,
      n.sent_count,
      n.type,
      n.created_at,
      au.name AS sent_by_name
    FROM notifications n
    LEFT JOIN admin_users au ON au.id = n.sent_by_admin
    WHERE n.sent_by_admin IS NOT NULL
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  return { total, data: rows };
};
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
  let targets = []; // [{ fcm_token, user_id, astrologer_id }]

  if (target === 'all') {
    const [users] = await pool.query('SELECT id, fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"');
    const [astros] = await pool.query('SELECT id, fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active"');
    users.forEach((r) => targets.push({ fcm_token: r.fcm_token, user_id: r.id, astrologer_id: null }));
    astros.forEach((r) => targets.push({ fcm_token: r.fcm_token, user_id: null, astrologer_id: r.id }));

  } else if (target === 'users') {
    const [rows] = await pool.query('SELECT id, fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"');
    rows.forEach((r) => targets.push({ fcm_token: r.fcm_token, user_id: r.id, astrologer_id: null }));

  } else if (target === 'astrologers') {
    const [rows] = await pool.query('SELECT id, fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active"');
    rows.forEach((r) => targets.push({ fcm_token: r.fcm_token, user_id: null, astrologer_id: r.id }));

  } else if ((target === 'specific_user' || target === 'specific_astrologer') && recipient_ids?.length) {
    const userIds = recipient_ids.filter((r) => r.type === 'user').map((r) => r.id);
    const astroIds = recipient_ids.filter((r) => r.type === 'astrologer').map((r) => r.id);

    if (userIds.length) {
      const [rows] = await pool.query('SELECT id, fcm_token FROM users WHERE id IN (?)', [userIds]);
      rows.forEach((r) => targets.push({ fcm_token: r.fcm_token, user_id: r.id, astrologer_id: null }));
    }
    if (astroIds.length) {
      const [rows] = await pool.query('SELECT id, fcm_token FROM astrologers WHERE id IN (?)', [astroIds]);
      rows.forEach((r) => targets.push({ fcm_token: r.fcm_token, user_id: null, astrologer_id: r.id }));
    }
  }

  // Deduplicate by fcm_token
  const seen = new Set();
  targets = targets.filter((t) => { if (seen.has(t.fcm_token)) return false; seen.add(t.fcm_token); return true; });

  // Send FCM + save one row per recipient
  let sentCount = 0;
  for (const t of targets) {
    let delivered = 0;
    try {
      await sendNotification({ token: t.fcm_token, title, body: message, image });
      delivered = 1;
      sentCount++;
    } catch (_) { /* invalid token, still save record */ }

    await pool.query(
      `INSERT INTO notifications
         (user_id, astrologer_id, title, message, image, target_type, sent_count, sent_by_admin, type, status)
       VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [
        t.user_id,
        t.astrologer_id,
        title, message, image || null,
        target,
        delivered,
        sent_by,
        'push',
        'unread',
      ]
    );
  }

  // For broadcast targets (all/users/astrologers) also save one summary row if no individual targets found
  if (targets.length === 0) {
    await pool.query(
      `INSERT INTO notifications (title, message, image, target_type, sent_count, sent_by_admin, type, status)
       VALUES (?,?,?,?,?,?,?,?)`,
      [title, message, image || null, target, 0, sent_by, 'push', 'unread']
    );
  }

  return sentCount;
};

exports.getHistory = async ({ page, limit }) => {
  const offset = (page - 1) * limit;

  // Group by title+message+target_type+sent_by_admin sent at same time (broadcast rows)
  // For specific: show individual rows with user/astro name
  const [[{ total }]] = await pool.query(
    `SELECT COUNT(*) AS total FROM notifications WHERE sent_by_admin IS NOT NULL`
  );

  const [rows] = await pool.query(`
    SELECT
      n.id, n.title, n.message, n.image, n.target_type, n.sent_count, n.type, n.status, n.created_at,
      n.user_id, n.astrologer_id,
      u.name  AS user_name,
      u.mobile AS user_phone,
      a.name  AS astrologer_name,
      a.phone AS astrologer_phone,
      au.name AS sent_by_name
    FROM notifications n
    LEFT JOIN users       u  ON u.id  = n.user_id
    LEFT JOIN astrologers a  ON a.id  = n.astrologer_id
    LEFT JOIN admin_users au ON au.id = n.sent_by_admin
    WHERE n.sent_by_admin IS NOT NULL
    ORDER BY n.created_at DESC
    LIMIT ? OFFSET ?
  `, [limit, offset]);

  return { total, data: rows };
};
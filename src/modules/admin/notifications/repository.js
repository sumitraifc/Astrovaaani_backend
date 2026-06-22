const pool = require('../../../config/db');
const { sendNotification } = require('../../../config/notification');

exports.send = async ({ title, message, image, target, type, recipient_ids, sent_by }) => {
  const isSpecific = target === 'specific_user' || target === 'specific_astrologer';
  let fcmTargets = []; // [{ fcm_token, user_id, astrologer_id }]

  if (target === 'all') {
    const [users] = await pool.query('SELECT id, fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"');
    const [astros] = await pool.query('SELECT id, fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active" AND approval_status = "approved"');
    users.forEach((r) => fcmTargets.push({ fcm_token: r.fcm_token, user_id: r.id, astrologer_id: null }));
    astros.forEach((r) => fcmTargets.push({ fcm_token: r.fcm_token, user_id: null, astrologer_id: r.id }));

  } else if (target === 'users') {
    const [rows] = await pool.query('SELECT id, fcm_token FROM users WHERE fcm_token IS NOT NULL AND status = "active"');
    rows.forEach((r) => fcmTargets.push({ fcm_token: r.fcm_token, user_id: r.id, astrologer_id: null }));

  } else if (target === 'astrologers') {
    const [rows] = await pool.query('SELECT id, fcm_token FROM astrologers WHERE fcm_token IS NOT NULL AND status = "active" AND approval_status = "approved"');
    rows.forEach((r) => fcmTargets.push({ fcm_token: r.fcm_token, user_id: null, astrologer_id: r.id }));

  } else if (isSpecific && recipient_ids?.length) {
    const userIds  = recipient_ids.filter((r) => r.type === 'user').map((r) => r.id);
    const astroIds = recipient_ids.filter((r) => r.type === 'astrologer').map((r) => r.id);
    if (userIds.length) {
      const [rows] = await pool.query('SELECT id, fcm_token FROM users WHERE id IN (?)', [userIds]);
      rows.forEach((r) => fcmTargets.push({ fcm_token: r.fcm_token, user_id: r.id, astrologer_id: null }));
    }
    if (astroIds.length) {
      const [rows] = await pool.query('SELECT id, fcm_token FROM astrologers WHERE id IN (?)', [astroIds]);
      rows.forEach((r) => fcmTargets.push({ fcm_token: r.fcm_token, user_id: null, astrologer_id: r.id }));
    }
  }

  // Deduplicate by fcm_token
  const seen = new Set();
  fcmTargets = fcmTargets.filter((t) => {
    if (seen.has(t.fcm_token)) return false;
    seen.add(t.fcm_token);
    return true;
  });

  // Send FCM to all targets
  let sentCount = 0;
  for (const t of fcmTargets) {
    try { await sendNotification({ token: t.fcm_token, title, body: message, image }); sentCount++; } catch (_) {}
  }

  const notifType = type || 'push';

  // ── DB Save Strategy ──────────────────────────────────────────────────────
  // Broadcast (all / users / astrologers) → 1 summary row, user_id = NULL
  //   → keeps DB lean even with 100k users
  // Specific → 1 row per recipient so we can track who received what
  // ─────────────────────────────────────────────────────────────────────────
  if (!isSpecific) {
    await pool.query(
      `INSERT INTO notifications
         (user_id, astrologer_id, title, message, image, target_type, sent_count, sent_by_admin, type, status)
       VALUES (NULL, NULL, ?,?,?,?,?,?,?,?)`,
      [title, message, image || null, target, sentCount, sent_by, notifType, 'unread']
    );
  } else {
    // If fcm tokens found — save per token
    if (fcmTargets.length) {
      for (const t of fcmTargets) {
        await pool.query(
          `INSERT INTO notifications
             (user_id, astrologer_id, title, message, image, target_type, sent_count, sent_by_admin, type, status)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [t.user_id, t.astrologer_id, title, message, image || null, target, 1, sent_by, notifType, 'unread']
        );
      }
    } else {
      // No fcm token but still log the attempt per requested recipient
      for (const rec of recipient_ids) {
        await pool.query(
          `INSERT INTO notifications
             (user_id, astrologer_id, title, message, image, target_type, sent_count, sent_by_admin, type, status)
           VALUES (?,?,?,?,?,?,?,?,?,?)`,
          [
            rec.type === 'user'       ? rec.id : null,
            rec.type === 'astrologer' ? rec.id : null,
            title, message, image || null, target, 0, sent_by, notifType, 'unread',
          ]
        );
      }
    }
  }

  return sentCount;
};

exports.getHistory = async ({ page, limit }) => {
  const offset = (page - 1) * limit;
  const [[{ total }]] = await pool.query(
    'SELECT COUNT(*) AS total FROM notifications WHERE sent_by_admin IS NOT NULL'
  );
  const [rows] = await pool.query(`
    SELECT
      n.id, n.title, n.message, n.image, n.target_type, n.sent_count,
      n.type, n.status, n.created_at,
      n.user_id, n.astrologer_id,
      u.name  AS user_name,  u.mobile AS user_phone,
      a.name  AS astrologer_name, a.phone AS astrologer_phone,
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

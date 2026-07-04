const db = require("../../config/db");

// exports.getNotifications = async (userId) => {
//   const [rows] = await db.query(
//     `
//     SELECT * FROM notifications
//     WHERE user_id=?
//     ORDER BY id DESC
//   `,
//     [userId]
//   );

//   return rows;
// };

exports.getNotifications = async (userId, astrologerId, role, page, limit) => {
  page  = parseInt(page)  || 1;
  limit = parseInt(limit) || 20;
  const offset = (page - 1) * limit;

  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM notifications
     WHERE target_type = 'all'
       OR (target_type = 'users' AND ? = 'user')
       OR (target_type = 'astrologers' AND ? = 'astrologer')
       OR user_id = ?
       OR astrologer_id = ?`,
    [role, role, userId, astrologerId]
  );

  const [rows] = await db.query(
    `SELECT * FROM notifications
     WHERE target_type = 'all'
       OR (target_type = 'users' AND ? = 'user')
       OR (target_type = 'astrologers' AND ? = 'astrologer')
       OR user_id = ?
       OR astrologer_id = ?
     ORDER BY id DESC LIMIT ? OFFSET ?`,
    [role, role, userId, astrologerId, limit, offset]
  );

  return { total, page, limit, rows };
};

exports.markAsRead = async (id, userId) => {
  await db.query(
    `
    UPDATE notifications
    SET status='read'
    WHERE id=? AND user_id=?
  `,
    [id, userId]
  );
};
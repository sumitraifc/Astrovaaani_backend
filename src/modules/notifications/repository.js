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

exports.getNotifications = async (userId, astrologerId, role) => {

  const [rows] = await db.query(
    `
    SELECT * FROM notifications
    WHERE 
      target_type = 'all'
      OR (target_type = 'users' AND ? = 'user')
      OR (target_type = 'astrologers' AND ? = 'astrologer')
      OR user_id = ?
      OR astrologer_id = ?
    ORDER BY id DESC
    `,
    [role, role, userId, astrologerId]
  );

  return rows;
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
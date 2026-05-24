const db = require("../../config/db");

exports.getNotifications = async (userId) => {
  const [rows] = await db.query(
    `
    SELECT * FROM notifications
    WHERE user_id=?
    ORDER BY id DESC
  `,
    [userId]
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
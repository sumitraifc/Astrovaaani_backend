const repo = require("./repository");

// exports.getNotifications = async (userId) => {
//   const notifications =
//     await repo.getNotifications(userId);

//   return {
//     success: true,
//     notifications
//   };
// };

// exports.getNotifications = async (userId, astrologerId, role) => {

//   const [rows] = await repo.getNotifications(userId, astrologerId, role);

//   return {
//     success: true,
//     notifications: rows
//   };
// };

exports.getNotifications = async (userId, astrologerId, role, page, limit) => {
  const result = await repo.getNotifications(userId, astrologerId, role, page, limit);
  return {
    success: true,
    total: result.total,
    page: result.page,
    limit: result.limit,
    notifications: result.rows
  };
};

exports.markAsRead = async (id, userId) => {
  await repo.markAsRead(id, userId);

  return {
    success: true,
    message: "Notification read"
  };
};
const repo = require("./repository");

// exports.getNotifications = async (userId) => {
//   const notifications =
//     await repo.getNotifications(userId);

//   return {
//     success: true,
//     notifications
//   };
// };

exports.getNotifications = async (userId, astrologerId, role) => {

  const [rows] = await repo.getNotifications(userId, astrologerId, role);

  return {
    success: true,
    notifications: rows
  };
};

exports.markAsRead = async (id, userId) => {
  await repo.markAsRead(id, userId);

  return {
    success: true,
    message: "Notification read"
  };
};
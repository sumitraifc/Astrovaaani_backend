const repo = require("./repository");

exports.getNotifications = async (userId) => {
  const notifications =
    await repo.getNotifications(userId);

  return {
    success: true,
    notifications
  };
};

exports.markAsRead = async (id, userId) => {
  await repo.markAsRead(id, userId);

  return {
    success: true,
    message: "Notification read"
  };
};
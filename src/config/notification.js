const admin = require("./firebase");

exports.sendNotification = async ({
  token,
  title,
  body,
  image = null,
  data = {}
}) => {

  if (!token) {
    return null;
  }

  const message = {
    token,

    notification: {
      title: title || "",
      body: body || ""
    },

    data: Object.keys(data).reduce((acc, key) => {
      acc[key] = String(data[key]);
      return acc;
    }, {})
  };

  // image support
  if (image) {
    message.notification.imageUrl = image;
  }

  return await admin.messaging().send(message);
};
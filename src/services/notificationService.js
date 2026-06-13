const admin = require("../config/firebase");

function normalizeFcmData(data = {}) {
  return Object.entries(data).reduce((acc, [key, value]) => {
    acc[key] = value === undefined || value === null ? "" : String(value);
    return acc;
  }, {});
}

function buildFcmMessage({ token, topic, title, body, data = {}, notificationType = "notification" }) {
  if (!token && !topic) {
    throw new Error("FCM token or topic is required");
  }

  const normalizedData = normalizeFcmData({
    title: title || "",
    body: body || "",
    click_action: "FLUTTER_NOTIFICATION_CLICK",
    ...data
  });

  const message = {
    ...(token && { token }),
    ...(topic && { topic }),
    data: normalizedData,
    android: {
      priority: "high"
    },
    apns: {
      headers: {
        "apns-priority": "10"
      },
      payload: {
        aps: {
          sound: "default",
          badge: 1,
          "content-available": 1,
          "mutable-content": 1
        }
      }
    }
  };

  if (notificationType === "notification") {
    message.notification = {
      title: title || "",
      body: body || ""
    };
  }

  return message;
}

async function sendFcmNotification({ token, title, body, data = {} }) {
  if (!token) {
    throw new Error("FCM token is required");
  }

  const message = buildFcmMessage({ token, title, body, data, notificationType: "data" });
  return await admin.messaging().send(message);
}

async function sendTopicNotification({ topic, title, body, data = {} }) {
  if (!topic) {
    throw new Error("FCM topic is required");
  }

  const message = buildFcmMessage({ topic, title, body, data, notificationType: "notification" });
  return await admin.messaging().send(message);
}

async function sendNotification({ token, topic, title, body, image = null, data = {}, type = "notification" }) {
  const message = buildFcmMessage({
    token,
    topic,
    title,
    body,
    data,
    notificationType: type === "notification" ? "notification" : "data"
  });

  if (image && type === "notification") {
    message.notification = message.notification || {};
    message.notification.imageUrl = image;
  }

  return await admin.messaging().send(message);
}

module.exports = {
  sendFcmNotification,
  sendTopicNotification,
  sendNotification
};

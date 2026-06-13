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

/**
 * Send notification with retry logic
 * इसे multiple times भेजेगा अगर पहली बार fail हो
 */
async function sendNotificationWithRetry({ token, title, body, data = {}, maxRetries = 2 }) {
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const message = buildFcmMessage({
        token,
        title,
        body,
        data,
        notificationType: "data"
      });

      const response = await admin.messaging().send(message);
      console.log(`[FCM-RETRY] Success on attempt ${attempt}: ${response}`);
      return { success: true, response, attempt };
    } catch (error) {
      lastError = error;
      console.log(`[FCM-RETRY] Attempt ${attempt} failed:`, error.message);

      // Agar token invalid hai, to aur retry mat karo
      if (
        error.code === "messaging/registration-token-not-registered" ||
        error.code === "messaging/invalid-registration-token"
      ) {
        console.log(`[FCM-RETRY] Invalid token detected. Not retrying.`);
        break;
      }

      // Wait before retry
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  console.log(`[FCM-RETRY] Failed after ${maxRetries} attempts:`, lastError?.message);
  throw lastError;
}

async function sendFcmNotification({ token, title, body, data = {} }) {
  if (!token) {
    throw new Error("FCM token is required");
  }

  return await sendNotificationWithRetry({ token, title, body, data });
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
  sendNotification,
  sendNotificationWithRetry
};

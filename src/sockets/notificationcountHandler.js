// const db = require("../config/db");

// module.exports = (io, socket) => {

//   /**
//    * =========================================
//    * GET NOTIFICATION COUNT
//    * =========================================
//    * Emit: "get_notification_count"
//    * Data: { type: "user" | "astrologer", id: number }
//    */
//   socket.on("get_notification_count", async (data, callback) => {
//     try {
//       const { type, id } = data;

//       if (!type || !id) {
//         return callback?.({ success: false, message: "type and id required" });
//       }

//       let count = 0;

//       if (type === "user") {
//         const [rows] = await db.query(
//           `SELECT COUNT(*) as count
//            FROM notifications
//            WHERE user_id = ?
//            AND status = 'unread'
//            AND target_type IN ('all', 'users', 'specific_user')`,
//           [id]
//         );
//         count = Number(rows[0]?.count || 0);

//       } else if (type === "astrologer") {
//         const [rows] = await db.query(
//           `SELECT COUNT(*) as count
//            FROM notifications
//            WHERE astrologer_id = ?
//            AND status = 'unread'
//            AND target_type IN ('all', 'astrologers', 'specific_astrologer')`,
//           [id]
//         );
//         count = Number(rows[0]?.count || 0);
//       }

//       callback?.({
//         success: true,
//         count
//       });

//     } catch (err) {
//       console.log("[NOTIFICATION COUNT ERROR]", err.message);
//       callback?.({ success: false, message: err.message });
//     }
//   });

//   /**
//    * =========================================
//    * GET NOTIFICATIONS LIST
//    * =========================================
//    * Emit: "get_notifications"
//    * Data: { type: "user" | "astrologer", id: number, page: number (optional) }
//    */
//   socket.on("get_notifications", async (data, callback) => {
//     try {
//       const { type, id, page = 1 } = data;
//       const limit = 20;
//       const offset = (page - 1) * limit;

//       if (!type || !id) {
//         return callback?.({ success: false, message: "type and id required" });
//       }

//       let rows = [];

//       if (type === "user") {
//         [rows] = await db.query(
//           `SELECT
//             id,
//             title,
//             message,
//             image,
//             type,
//             status,
//             created_at
//            FROM notifications
//            WHERE user_id = ?
//            AND target_type IN ('all', 'users', 'specific_user')
//            ORDER BY created_at DESC
//            LIMIT ? OFFSET ?`,
//           [id, limit, offset]
//         );

//       } else if (type === "astrologer") {
//         [rows] = await db.query(
//           `SELECT
//             id,
//             title,
//             message,
//             image,
//             type,
//             status,
//             created_at
//            FROM notifications
//            WHERE astrologer_id = ?
//            AND target_type IN ('all', 'astrologers', 'specific_astrologer')
//            ORDER BY created_at DESC
//            LIMIT ? OFFSET ?`,
//           [id, limit, offset]
//         );
//       }

//       callback?.({
//         success: true,
//         data: rows
//       });

//     } catch (err) {
//       console.log("[GET NOTIFICATIONS ERROR]", err.message);
//       callback?.({ success: false, message: err.message });
//     }
//   });

//   /**
//    * =========================================
//    * MARK SINGLE NOTIFICATION AS READ
//    * =========================================
//    * Emit: "mark_notification_read"
//    * Data: { notification_id: number, type: "user" | "astrologer", id: number }
//    */
//   socket.on("mark_notification_read", async (data, callback) => {
//     try {
//       const { notification_id, type, id } = data;

//       if (!notification_id || !type || !id) {
//         return callback?.({ success: false, message: "notification_id, type and id required" });
//       }

//       await db.query(
//         `UPDATE notifications
//          SET status = 'read'
//          WHERE id = ?`,
//         [notification_id]
//       );

//       // Updated count bhejo
//       let count = 0;

//       if (type === "user") {
//         const [rows] = await db.query(
//           `SELECT COUNT(*) as count
//            FROM notifications
//            WHERE user_id = ?
//            AND status = 'unread'
//            AND target_type IN ('all', 'users', 'specific_user')`,
//           [id]
//         );
//         count = Number(rows[0]?.count || 0);

//         // User ke room mein updated count bhejo
//         socket.emit("notification_count_updated", { count });

//       } else if (type === "astrologer") {
//         const [rows] = await db.query(
//           `SELECT COUNT(*) as count
//            FROM notifications
//            WHERE astrologer_id = ?
//            AND status = 'unread'
//            AND target_type IN ('all', 'astrologers', 'specific_astrologer')`,
//           [id]
//         );
//         count = Number(rows[0]?.count || 0);

//         // Astrologer ke room mein updated count bhejo
//         socket.emit("notification_count_updated", { count });
//       }

//       callback?.({
//         success: true,
//         message: "Notification marked as read",
//         count
//       });

//     } catch (err) {
//       console.log("[MARK READ ERROR]", err.message);
//       callback?.({ success: false, message: err.message });
//     }
//   });

//   /**
//    * =========================================
//    * MARK ALL NOTIFICATIONS AS READ
//    * =========================================
//    * Emit: "mark_all_notifications_read"
//    * Data: { type: "user" | "astrologer", id: number }
//    */
//   socket.on("mark_all_notifications_read", async (data, callback) => {
//     try {
//       const { type, id } = data;

//       if (!type || !id) {
//         return callback?.({ success: false, message: "type and id required" });
//       }

//       if (type === "user") {
//         await db.query(
//           `UPDATE notifications
//            SET status = 'read'
//            WHERE user_id = ?
//            AND status = 'unread'
//            AND target_type IN ('all', 'users', 'specific_user')`,
//           [id]
//         );

//       } else if (type === "astrologer") {
//         await db.query(
//           `UPDATE notifications
//            SET status = 'read'
//            WHERE astrologer_id = ?
//            AND status = 'unread'
//            AND target_type IN ('all', 'astrologers', 'specific_astrologer')`,
//           [id]
//         );
//       }

//       // Count 0 emit karo
//       socket.emit("notification_count_updated", { count: 0 });

//       callback?.({
//         success: true,
//         message: "All notifications marked as read",
//         count: 0
//       });

//     } catch (err) {
//       console.log("[MARK ALL READ ERROR]", err.message);
//       callback?.({ success: false, message: err.message });
//     }
//   });

// };


// /**
//  * =========================================
//  * SEND NOTIFICATION TO SPECIFIC USER/ASTROLOGER
//  * (Admin ya kisi aur handler se call karo)
//  * =========================================
//  * Usage:
//  *   const { sendNotificationToSocket } = require("./notificationHandler");
//  *   sendNotificationToSocket(io, "user", user_id, notificationData);
//  */
// const sendNotificationToSocket = (io, type, id, notificationData) => {
//   if (type === "user") {
//     io.to(`user_${id}`).emit("new_notification", notificationData);
//     io.to(`user_${id}`).emit("notification_count_updated", {
//       count: notificationData.unread_count || 0
//     });
//   } else if (type === "astrologer") {
//     io.to(`astrologer_${id}`).emit("new_notification", notificationData);
//     io.to(`astrologer_${id}`).emit("notification_count_updated", {
//       count: notificationData.unread_count || 0
//     });
//   }
// };

// module.exports.sendNotificationToSocket = sendNotificationToSocket;




const db = require("../config/db");

module.exports = (io, socket) => {

  /**
   * =========================================
   * GET NOTIFICATION COUNT
   * App open hone pe call karo
   * Data: { type: "user" | "astrologer", id: number }
   * =========================================
   */
  socket.on("get_notification_count", async (data, callback) => {
    try {
      const { type, id } = data;

      if (!type || !id) {
        return callback?.({ success: false, message: "type and id required" });
      }

      const count = await getUnreadCount(type, id);

      callback?.({ success: true, count });

    } catch (err) {
      console.log("[NOTIFICATION COUNT ERROR]", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  /**
   * =========================================
   * MARK ALL AS READ + COUNT 0
   * Bell icon click hone pe call karo
   * Data: { type: "user" | "astrologer", id: number }
   * =========================================
   */
  socket.on("mark_all_notifications_read", async (data, callback) => {
    try {
      const { type, id } = data;

      if (!type || !id) {
        return callback?.({ success: false, message: "type and id required" });
      }

      if (type === "user") {
        await db.query(
          `UPDATE notifications
           SET status = 'read'
           WHERE status = 'unread'
           AND (
             (target_type = 'specific_user' AND user_id = ?)
             OR target_type = 'users'
             OR target_type = 'all'
           )`,
          [id]
        );
      } else {
        await db.query(
          `UPDATE notifications
           SET status = 'read'
           WHERE status = 'unread'
           AND (
             (target_type = 'specific_astrologer' AND astrologer_id = ?)
             OR target_type = 'astrologers'
             OR target_type = 'all'
           )`,
          [id]
        );
      }

      // Count 0 emit karo
      socket.emit("notification_count_updated", { count: 0 });

      callback?.({ success: true, count: 0 });

    } catch (err) {
      console.log("[MARK ALL READ ERROR]", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

};

/**
 * =========================================
 * HELPER — Unread count fetch karo
 * =========================================
 */
const getUnreadCount = async (type, id) => {
  let rows;

  if (type === "user") {
    [rows] = await db.query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE status = 'unread'
       AND (
         (target_type = 'specific_user' AND user_id = ?)
         OR target_type = 'users'
         OR target_type = 'all'
       )`,
      [id]
    );
  } else {
    [rows] = await db.query(
      `SELECT COUNT(*) as count
       FROM notifications
       WHERE status = 'unread'
       AND (
         (target_type = 'specific_astrologer' AND astrologer_id = ?)
         OR target_type = 'astrologers'
         OR target_type = 'all'
       )`,
      [id]
    );
  }

  return Number(rows[0]?.count || 0);
};

/**
 * =========================================
 * NEW NOTIFICATION AANE PE COUNT BADHAO
 * Admin controller mein call karo jab bhi
 * notification save ho DB mein
 *
 * Usage:
 *   const { pushNotificationCount } = require("./notificationHandler");
 *   await pushNotificationCount(io, "user", user_id);
 *   await pushNotificationCount(io, "astrologer", astrologer_id);
 * =========================================
 */
const pushNotificationCount = async (io, type, id) => {
  try {
    const count = await getUnreadCount(type, id);
    const room = type === "user" ? `user_${id}` : `astrologer_${id}`;

    io.to(room).emit("notification_count_updated", { count });

    console.log(`[NOTIFICATION] Count pushed to ${room}: ${count}`);
  } catch (err) {
    console.log("[PUSH COUNT ERROR]", err.message);
  }
};

module.exports.pushNotificationCount = pushNotificationCount;
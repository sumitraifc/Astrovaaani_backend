const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { setAstrologerOnlineStatus } = require("./astrologerHandler");
// const { setAstrologerOnlineStatus, setAstrologerChatStatus } = require("./astrologerHandler");
const { sendNotification } = require("../config/notification");
const { settleConsultationCharge } = require("../utils/settlement");

const activeTimers = {};
const onlineUsers = {};

async function getFcmTokenByType(type, id) {
  const table = type === "astrologer" ? "astrologers" : "users";
  const [rows] = await db.query(
    `SELECT fcm_token FROM ${table} WHERE id = ? LIMIT 1`,
    [id]
  );
  return rows[0]?.fcm_token || null;
}

async function notifyPush({ targetType, targetId, title, body, data = {} }) {
  const table = targetType === "astrologer" ? "astrologers" : "users";
  const token = await getFcmTokenByType(targetType, targetId);
  if (!token) {
    console.log(`[FCM] No token for ${targetType} ${targetId}`);
    return null;
  }
  try {
    return await sendNotification({ token, title, body, data });
  } catch (err) {
    console.log(`[FCM ERROR] Push failed for ${targetType} ${targetId}:`, err.message);
    try {
      const preview = token ? `${token.slice(0, 8)}... (len ${token.length})` : "null";
      console.log(`[FCM] Token preview for ${targetType} ${targetId}:`, preview);
    } catch (e) {
      // ignore preview errors
    }

    const msg = err.message || "";
    const code = err.code || "";

    // If token is invalid / not found on FCM, clear it from DB to avoid repeated failures
    if (
      msg.includes("Requested entity was not found") ||
      msg.includes("registration token is not registered") ||
      code === "messaging/registration-token-not-registered" ||
      code === "messaging/invalid-registration-token"
    ) {
      try {
        await db.query(`UPDATE ${table} SET fcm_token = NULL WHERE id = ?`, [targetId]);
        console.log(`[FCM] Cleared invalid token for ${targetType} ${targetId}`);
      } catch (e) {
        console.log(`[FCM] Failed to clear token for ${targetType} ${targetId}:`, e.message);
      }
    }

    return null;
  }
}

async function notifyChatRecipient({ conversation, sender_type, sender_id, message, message_type, file_url }) {
  const recipientType = sender_type === "user" ? "astrologer" : "user";
  const recipientId = sender_type === "user" ? conversation.astrologer_id : conversation.user_id;
  if (!recipientId) return null;

  const isRecipientOnline =
    recipientType === "astrologer"
      ? conversation.is_astrologer_online === 1
      : conversation.is_user_online === 1;

  if (isRecipientOnline) {
    return null;
  }

  const title =
    sender_type === "user"
      ? "New message from user"
      : "New message from astrologer";

  const body = message
    ? message.length > 100
      ? `${message.slice(0, 97)}...`
      : message
    : file_url
    ? "You received a new file"
    : "You have a new message";

  return notifyPush({
    targetType: recipientType,
    targetId: recipientId,
    title,
    body,
    data: {
      type: "chat_message",
      conversation_id: conversation.conversation_id,
      sender_type,
      sender_id,
      msg_type: message_type || "text",
      file_url: file_url || ""
    }
  });
}

module.exports = (io, socket) => {
  /**
   * =========================================
   * CREATE CONVERSATION
   * =========================================
   */
  socket.on("create_conversation", async (data, callback) => {
    try {
      const { user_id, astrologer_id } = data;

      /**
       * UNIQUE CONVERSATION ID
       */
      const firstId = Math.min(user_id, astrologer_id);
      const secondId = Math.max(user_id, astrologer_id);
      const uniqueKey = `${firstId}_${secondId}_${Date.now()}`;

      /**
       * USER DETAILS
       */
      const [userRows] = await db.query(
        `
        SELECT
          id,
          name
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [user_id]
      );

      if (!userRows.length) {
        return callback({
          success: false,
          message: "User not found"
        });
      }

      /**
       * ASTROLOGER DETAILS
       */
      const [astroRows] = await db.query(
        `
        SELECT
          id,
          name,
          chat_charge,
           is_online
        FROM astrologers
        WHERE id = ?
        LIMIT 1
        `,
        [astrologer_id]
      );

      if (!astroRows.length) {
        return callback({
          success: false,
          message: "Astrologer not found"
        });
      }

      /**
       * ASTROLOGER BUSY CHECK
       */
      // if (astroRows[0].chat_status === "busy") {
      if (Number(astroRows[0].is_online) === 2) {
        return callback({
          success: false,
          message: "Astrologer is busy"
        });
      }

      /**
       * CHARGE PER MINUTE
       */
      const chargePerMin = Number(astroRows[0]?.chat_charge || 0);

      /**
       * USER WALLET
       */
      const [walletRows] = await db.query(
        `
        SELECT balance
        FROM wallet
        WHERE user_id = ?
        LIMIT 1
        `,
        [user_id]
      );

      const walletBalance = Number(walletRows[0]?.balance || 0);

      /**
       * BALANCE CHECK
       */
      if (walletBalance < chargePerMin) {
        return callback({
          success: false,
          message: `Minimum balance required is ₹${chargePerMin}`
        });
      }

      /**
       * CREATE CHAT
       */
      const [insertResult] = await db.query(
        `
        INSERT INTO chat_conversations
        (
          uuid,
          conversation_id,
          user_id,
          astrologer_id,
          status,
          charge_per_min,
          amount,
          duration,
          started_at,
          created_at,
          updated_at
        )
        VALUES
        (
          ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW(), NOW()
        )
        `,
        [uuidv4(), uniqueKey, user_id, astrologer_id, "active", chargePerMin, 0, 0]
      );



const orderId = "CHAT" + Date.now();

await db.query(
`
INSERT INTO orders
(
  order_id,
  conversation_id,
  user_id,
  astrologer_id,
  astrologer_name,
  consultation_type,
  price,
  status,
  start_time
)
VALUES
(
  ?, ?, ?, ?, ?, ?, ?, ?, NOW()
)
`,
[
  orderId,
  uniqueKey,
  user_id,
  astrologer_id,
  astroRows[0].name,
  "chat",
  0,
  "pending"
]
);

      await db.query(
        `UPDATE astrologers
         SET total_sessions = COALESCE(total_sessions,0) + 1,
             total_chats = COALESCE(total_chats,0) + 1
         WHERE id = ?`,
        [astrologer_id]
      );

      /**
       * ASTROLOGER BUSY
       */
      // await db.query(
      //   `
      //   UPDATE astrologers
      //   SET chat_status = 'busy'
      //   WHERE id = ?
      //   `,
      //   [astrologer_id]
      // );

      // await setAstrologerChatStatus(io, astrologer_id, "busy");
      await setAstrologerOnlineStatus(
  io,
  astrologer_id,
  2
);

console.log(
  `[CHAT STARTED] Astrologer ${astrologer_id} -> BUSY`
);

      /**
       * GET CONVERSATION
       */
      const [conversationRows] = await db.query(
        `
        SELECT
          cc.*,
          u.name AS user_name,
          a.name AS astrologer_name
        FROM chat_conversations cc
        LEFT JOIN users u
          ON u.id = cc.user_id
        LEFT JOIN astrologers a
          ON a.id = cc.astrologer_id
        WHERE cc.id = ?
        LIMIT 1
        `,
        [insertResult.insertId]
      );

      const conversation = conversationRows[0];
      /**
 * GET ASTROLOGER FCM TOKEN
 */
const [astroTokenRows] = await db.query(
  `
  SELECT fcm_token
  FROM astrologers
  WHERE id = ?
  LIMIT 1
  `,
  [astrologer_id]
);

const fcmToken = astroTokenRows[0]?.fcm_token;

/**
 * SEND PUSH NOTIFICATION
 */
if (fcmToken) {
  try {

    await sendNotification({
      token: fcmToken,
      title: "New Chat Request",
      body: `${userRows[0].name} has started a chat with you`,
      data: {
        type: "new_chat",
        conversation_id: conversation.conversation_id,
        user_id,
        astrologer_id,
        user_name: userRows[0].name
      }
    });

    console.log(
      `[FCM SENT] New chat notification sent to astrologer ${astrologer_id}`
    );

  } catch (error) {

    console.log(
      `[FCM ERROR]`,
      error.message
    );

  }
}

      /**
       * JOIN ROOM
       */
      socket.join("room_" + conversation.conversation_id);

      /**
       * STORE ONLINE USER
       */
      onlineUsers[socket.id] = {
        conversation_id: conversation.conversation_id,
        astrologer_id,
        user_id
      };
      console.log(conversation, "get conversation");
      callback({
        success: true,
        conversation_id: conversation.conversation_id,
        wallet_balance: walletBalance,
        conversation,
        socket_id: socket.id 
      });
    } catch (err) {
      console.log("Conversation Error:", err.message);
      callback({
        success: false,
        message: err.message
      });
    }
  });

  /**
   * =========================================
   * JOIN ROOM
   * =========================================
   */
socket.on("join_room", async (data, callback) => {
  try {
    const { conversation_id, sender_type } = data;

    const [roomRows] = await db.query(
      `
      SELECT id, astrologer_id, user_id
      FROM chat_conversations
      WHERE conversation_id = ?
      LIMIT 1
      `,
      [conversation_id]
    );

    if (!roomRows.length) {
      return callback?.({
        success: false,
        message: "Conversation not found"
      });
    }

    socket.join("room_" + conversation_id);

    onlineUsers[socket.id] = {
      conversation_id,
      sender_type,
      astrologer_id: roomRows[0].astrologer_id,
      user_id: roomRows[0].user_id
    };

    if (sender_type === "user") {
      await db.query(
        `
        UPDATE chat_conversations
        SET is_user_online = 1
        WHERE conversation_id = ?
        `,
        [conversation_id]
      );
    } else {
      await db.query(
        `
        UPDATE chat_conversations
        SET is_astrologer_online = 1
        WHERE conversation_id = ?
        `,
        [conversation_id]
      );
    }

    io.to("room_" + conversation_id).emit("user_joined", {
      sender_type,
      conversation_id
    });

    callback?.({
      success: true,
      message: "Room joined successfully",
      conversation_id
    });

  } catch (err) {
    console.log("Join Room Error:", err.message);

    callback?.({
      success: false,
      message: err.message
    });
  }
});


/**
 * =========================================
 * CHAT LIST (USER / ASTROLOGER)
 * =========================================
 */

// socket.on("get_chat_list", async (data, callback) => {
//   try {
//     const { user_id, astrologer_id, sender_type } = data;

//     let rows = [];

//     if (sender_type === "user") {
//       [rows] = await db.query(`
//         SELECT
//           cc.conversation_id,
//           cc.status,
//           cc.last_message,
//           cc.last_message_at,

//           a.id AS astrologer_id,
//           a.name,
//           a.profile_image,

//           (
//             SELECT COUNT(*)
//             FROM chat_messages cm
//             WHERE cm.conversation_id = cc.conversation_id
//               AND cm.sender_type = 'astrologer'
//               AND cm.is_read = 0
//           ) AS unread_count

//         FROM chat_conversations cc
//         JOIN astrologers a ON a.id = cc.astrologer_id
//         WHERE cc.user_id = ?
//         ORDER BY cc.last_message_at DESC
//       `, [user_id]);
//     } else {
//       [rows] = await db.query(`
//         SELECT
//           cc.conversation_id,
//           cc.status,
//           cc.last_message,
//           cc.last_message_at,

//           u.id AS user_id,
//           u.name,
//           u.profile_image,

//           (
//             SELECT COUNT(*)
//             FROM chat_messages cm
//             WHERE cm.conversation_id = cc.conversation_id
//               AND cm.sender_type = 'user'
//               AND cm.is_read = 0
//           ) AS unread_count

//         FROM chat_conversations cc
//         JOIN users u ON u.id = cc.user_id
//         WHERE cc.astrologer_id = ?
//         ORDER BY cc.last_message_at DESC
//       `, [astrologer_id]);
//     }

//     callback?.({
//       success: true,
//       data: rows
//     });

//   } catch (err) {
//     console.log("Chat List Error:", err.message);

//     callback?.({
//       success: false,
//       message: err.message
//     });
//   }
// });


socket.on("get_chat_list", async (data, callback) => {
  try {

    console.log("\n=================================");
    console.log("🔥 GET CHAT LIST EVENT HIT");
    console.log("Socket ID:", socket.id);
    console.log("Incoming Data:", data);

    const { user_id, astrologer_id, sender_type } = data;

    console.log("sender_type:", sender_type);
    console.log("user_id:", user_id);
    console.log("astrologer_id:", astrologer_id);

    let rows = [];

    if (sender_type === "user") {

      console.log("👉 USER CHAT LIST QUERY RUNNING");

      const query = `
        SELECT
          cc.conversation_id,
          cc.status,
          cc.last_message,
          cc.last_message_at,

          a.id AS astrologer_id,
          a.name AS astrologer_name,
          a.profile_image AS astrologer_profile_image,

          (
            SELECT COUNT(*)
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
              AND cm.sender_type = 'astrologer'
              AND cm.is_read = 0
          ) AS unread_count

        FROM chat_conversations cc
        JOIN astrologers a ON a.id = cc.astrologer_id
        WHERE cc.user_id = ?
        ORDER BY cc.last_message_at DESC
      `;

      console.log("Query User ID:", user_id);

      [rows] = await db.query(query, [user_id]);

    } else {

      console.log("👉 ASTROLOGER CHAT LIST QUERY RUNNING");

      const query = `
        SELECT
          cc.conversation_id,
          cc.status,
          cc.last_message,
          cc.last_message_at,

          u.id AS user_id,
          u.name AS user_name,
          u.profile_image AS user_profile_image,

          (
            SELECT COUNT(*)
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
              AND cm.sender_type = 'user'
              AND cm.is_read = 0
          ) AS unread_count

        FROM chat_conversations cc
        JOIN users u ON u.id = cc.user_id
        WHERE cc.astrologer_id = ?
        ORDER BY cc.last_message_at DESC
      `;

      console.log("Query Astrologer ID:", astrologer_id);

      [rows] = await db.query(query, [astrologer_id]);
    }

    console.log("=================================");
    console.log("✅ TOTAL ROWS FOUND:", rows.length);

    if (rows.length > 0) {
      console.log("✅ FIRST ROW:");
      console.log(JSON.stringify(rows[0], null, 2));
    } else {
      console.log("❌ NO CHAT FOUND");
    }

    console.log("=================================\n");

    callback?.({
      success: true,
      data: rows
    });

  } catch (err) {

    console.log("\n=================================");
    console.log("❌ GET CHAT LIST ERROR");
    console.log("Message:", err.message);
    console.log("Stack:", err.stack);
    console.log("=================================\n");

    callback?.({
      success: false,
      message: err.message
    });
  }
});

// all chat history 

socket.on("get_chat_history", async (data, callback) => {
  try {

    console.log("\n=================================");
    console.log("🔥 GET FULL CHAT HISTORY HIT");
    console.log("Socket ID:", socket.id);
    console.log("Incoming Data:", data);

    const { user_id, astrologer_id } = data;

    console.log("user_id:", user_id);
    console.log("astrologer_id:", astrologer_id);

    if (!user_id || !astrologer_id) {
      return callback?.({
        success: false,
        message: "user_id and astrologer_id required"
      });
    }

    /**
     * GET USER + ASTROLOGER DETAILS
     */
    const [conversationInfo] = await db.query(
      `
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        u.profile_image AS user_profile_image,

        a.id AS astrologer_id,
        a.name AS astrologer_name,
        a.profile_image AS astrologer_profile_image

      FROM users u
      JOIN astrologers a
        ON a.id = ?
      WHERE u.id = ?
      LIMIT 1
      `,
      [astrologer_id, user_id]
    );

    if (!conversationInfo.length) {
      return callback?.({
        success: false,
        message: "User/Astrologer not found"
      });
    }

    const info = conversationInfo[0];

    info.user_profile_image = info.user_profile_image
      ? `${process.env.BASE_URL}/uploads/${info.user_profile_image}`
      : null;

    info.astrologer_profile_image = info.astrologer_profile_image
      ? `${process.env.BASE_URL}/uploads/${info.astrologer_profile_image}`
      : null;

    /**
     * GET ALL CONVERSATIONS
     */
    const [conversations] = await db.query(
      `
      SELECT
        conversation_id,
        status,
        started_at,
        ended_at,
        created_at
      FROM chat_conversations
      WHERE user_id = ?
      AND astrologer_id = ?
      ORDER BY created_at ASC
      `,
      [user_id, astrologer_id]
    );

    console.log("✅ TOTAL CONVERSATIONS:", conversations.length);

    if (!conversations.length) {
      return callback?.({
        success: true,
        data: {
          user: info,
          total_conversations: 0,
          total_messages: 0,
          messages: []
        }
      });
    }

    const conversationIds = conversations.map(
      (row) => row.conversation_id
    );

    console.log("Conversation IDs:", conversationIds);

    const placeholders = conversationIds
      .map(() => "?")
      .join(",");

    /**
     * GET ALL CHAT HISTORY
     */
    const [messages] = await db.query(
      `
      SELECT
        id,
        uuid,
        conversation_id,
        sender_type,
        sender_id,
        message,
        message_type,
        file_url,
        is_read,
        sent_at
      FROM chat_messages
      WHERE conversation_id IN (${placeholders})
      AND is_deleted = 0
      ORDER BY sent_at ASC
      `,
      conversationIds
    );

    console.log("✅ TOTAL MESSAGES:", messages.length);

    /**
     * FORMAT FILE URL
     */
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      uuid: msg.uuid,
      conversation_id: msg.conversation_id,
      sender_type: msg.sender_type,
      sender_id: msg.sender_id,
      message: msg.message,
      message_type: msg.message_type,

      file_url: msg.file_url
        ? `${process.env.BASE_URL}/uploads/${msg.file_url}`
        : null,

      is_read: msg.is_read,
      sent_at: msg.sent_at,

      time: new Date(msg.sent_at).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }));

    console.log(
      "✅ FORMATTED MESSAGES:",
      formattedMessages.length
    );

    if (formattedMessages.length) {
      console.log(
        "✅ FIRST MESSAGE:",
        JSON.stringify(formattedMessages[0], null, 2)
      );
    }

    console.log("=================================\n");

    /**
     * ACK RESPONSE
     */
    callback?.({
      success: true,
      message: "Chat history fetched successfully",
      data: {
        user: {
          user_id: info.user_id,
          user_name: info.user_name,
          user_profile_image: info.user_profile_image
        },

        astrologer: {
          astrologer_id: info.astrologer_id,
          astrologer_name: info.astrologer_name,
          astrologer_profile_image:
            info.astrologer_profile_image
        },

        total_conversations: conversations.length,
        total_messages: formattedMessages.length,

        // conversations,

        messages: formattedMessages
      }
    });

  } catch (err) {

    console.log("\n=================================");
    console.log("❌ GET CHAT HISTORY ERROR");
    console.log("Message:", err.message);
    console.log("Stack:", err.stack);
    console.log("=================================\n");

    callback?.({
      success: false,
      message: err.message
    });
  }
});
  /**
   * =========================================
   * TYPING
   * =========================================
   */
  socket.on("typing", (data) => {
    socket.to("room_" + data.conversation_id).emit("typing", {
      sender_type: data.sender_type
    });
  });

  /**
   * =========================================
   * STOP TYPING
   * =========================================
   */
  socket.on("stop_typing", (data) => {
    socket.to("room_" + data.conversation_id).emit("stop_typing");
  });

  /**
   * =========================================
   * SEND MESSAGE
   * =========================================
   */
  socket.on("send_message", async (data) => {
    try {
      const { conversation_id, sender_type, sender_id, message, message_type, file_url } = data;

      /**
       * VALIDATION
       */
      if (!message && !file_url) {
        return;
      }

      /**
       * SAVE MESSAGE
       */
      const [insertResult] = await db.query(
        `
        INSERT INTO chat_messages
        (
          uuid,
          conversation_id,
          sender_type,
          sender_id,
          message,
          message_type,
          file_url,
          sent_at
        )
        VALUES
        (
          ?, ?, ?, ?, ?, ?, ?, NOW()
        )
        `,
        [
          uuidv4(),
          conversation_id,
          sender_type,
          sender_id,
          message || null,
          message_type || "text",
          file_url || null
        ]
      );

      /**
       * GET MESSAGE
       */
      const [messageRows] = await db.query(
        `
        SELECT *
        FROM chat_messages
        WHERE id = ?
        `,
        [insertResult.insertId]
      );

      const savedMessage = messageRows[0];

      /**
       * UPDATE CONVERSATION
       */
      // await db.query(
      //   `
      //   UPDATE chat_conversations
      //   SET
      //     total_messages = total_messages + 1,
      //     last_message_at = NOW(),
      //     last_message = ?,
      //     updated_at = NOW()
      //   WHERE conversation_id = ?
      //   `,
      //   [message,conversation_id]
      // );
await db.query(
  `UPDATE chat_conversations
   SET
     total_messages = total_messages + 1,
     last_message_at = NOW(),
     last_message = ?,
     updated_at = NOW()
   WHERE conversation_id = ?`,
  [
    message || (message_type === "image" ? "📷 Photo" : "📎 File"),  // ← yeh add karo
    conversation_id
  ]
);
      /**
       * GET CONVERSATION
       */
      const [conversationRows] = await db.query(
        `
        SELECT *
        FROM chat_conversations
        WHERE conversation_id = ?
        LIMIT 1
        `,
        [conversation_id]
      );

      if (!conversationRows.length) {
        return;
      }

      const conversation = conversationRows[0];

      await notifyChatRecipient({
        conversation,
        sender_type,
        sender_id,
        message,
        message_type,
        file_url
      });

      /**
       * START TIMER
       * ONLY AFTER ASTROLOGER MESSAGE
       */
      if (sender_type === "astrologer" && !activeTimers[conversation_id]) {
        /**
         * CHECK TIMER
         */
        const [timerRows] = await db.query(
          `
          SELECT is_timer_running
          FROM chat_conversations
          WHERE conversation_id = ?
          LIMIT 1
          `,
          [conversation_id]
        );

        if (timerRows[0]?.is_timer_running) {
          return;
        }

        /**
         * START TIMER FLAG
         */
        await db.query(
          `
          UPDATE chat_conversations
          SET is_timer_running = 1
          WHERE conversation_id = ?
          `,
          [conversation_id]
        );

        console.log("Timer Started:", conversation_id);

        activeTimers[conversation_id] = setInterval(
          async () => {
            try {
              /**
               * LIVE CHARGE
               */
              const charge = Number(conversation.charge_per_min || 0);

              /**
               * INVALID CHARGE
               */
              if (charge <= 0) {
                return;
              }

              /**
               * LOW BALANCE
               */
              const [walletRows] = await db.query(
                `
                SELECT balance
                FROM wallet
                WHERE user_id = ?
                LIMIT 1
                `,
                [conversation.user_id]
              );

              const walletBalance = Number(walletRows[0]?.balance || 0);

              if (walletBalance <= charge) {
                io.to("room_" + conversation_id).emit("low_balance", {
                  balance: walletBalance
                });
              }

              const settlement = await settleConsultationCharge({
                user_id: conversation.user_id,
                astrologer_id: conversation.astrologer_id,
                amount: charge,
                sessionType: "chat",
                sessionId: conversation_id,
                reason: "Chat Consultation"
              });

              if (!settlement.success) {
                clearInterval(activeTimers[conversation_id]);
                delete activeTimers[conversation_id];

                /**
                 * END CHAT
                 */
                await db.query(
                  `
                  UPDATE chat_conversations
                  SET
                    status = 'ended',
                    ended_at = NOW(),
                    is_timer_running = 0
                  WHERE conversation_id = ?
                  `,
                  [conversation_id]
                );
                 
                await db.query(
  `UPDATE orders
   SET status = 'completed', end_time = NOW()
   WHERE conversation_id = ?`,
  [conversation_id]
);

                await setAstrologerOnlineStatus(
                  io,
                  conversation.astrologer_id,
                  1
                );

                console.log(
                  `[LOW BALANCE] Astrologer ${conversation.astrologer_id} -> ONLINE`
                );
                io.to("room_" + conversation_id).emit("chat_ended", {
                  success: false,
                  message: "Insufficient balance"
                });

                await notifyPush({
                  targetType: "user",
                  targetId: conversation.user_id,
                  title: "Wallet balance low",
                  body: "Your chat ended because your wallet balance is insufficient.",
                  data: {
                    type: "chat_ended",
                    conversation_id,
                    reason: "low_balance"
                  }
                });

                return;
              }

              if (!settlement.success) {
                clearInterval(activeTimers[conversation_id]);
                delete activeTimers[conversation_id];

                await db.query(
                  `
                  UPDATE chat_conversations
                  SET
                    status = 'ended',
                    ended_at = NOW(),
                    is_timer_running = 0
                  WHERE conversation_id = ?
                  `,
                  [conversation_id]
                );

                await db.query(
                  `UPDATE orders
                   SET status = 'completed', end_time = NOW()
                   WHERE conversation_id = ?`,
                  [conversation_id]
                );

                await setAstrologerOnlineStatus(io, conversation.astrologer_id, 1);

                io.to("room_" + conversation_id).emit("chat_ended", {
                  success: false,
                  message: "Insufficient balance"
                });

                await notifyPush({
                  targetType: "user",
                  targetId: conversation.user_id,
                  title: "Wallet balance low",
                  body: "Your chat ended because your wallet balance is insufficient.",
                  data: {
                    type: "chat_ended",
                    conversation_id,
                    reason: "low_balance"
                  }
                });

                return;
              }

              /**
               * UPDATE CHAT
               */
              await db.query(
                `
                UPDATE chat_conversations
                SET
                  amount = amount + ?,
                  duration = duration + 1,
                  updated_at = NOW()
                WHERE conversation_id = ?
                `,
                [charge, conversation_id]
              );

              await db.query(
                `UPDATE astrologers
                 SET total_chat_minutes = COALESCE(total_chat_minutes,0) + 1
                 WHERE id = ?`,
                [conversation.astrologer_id]
              );

              /**
               * UPDATED WALLET
               */
              const [updatedWallet] = await db.query(
                `
                SELECT balance
                FROM wallet
                WHERE user_id = ?
                LIMIT 1
                `,
                [conversation.user_id]
              );

              /**
               * EMIT BALANCE
               */
              io.to("room_" + conversation_id).emit("wallet_updated", {
                deducted: charge,
                remaining_balance: Number(updatedWallet[0]?.balance || 0)
              });

              console.log("Amount Deducted Successfully");
            } catch (err) {
              console.log("Timer Error:", err.message);
            }
          },
          60000
        );
      }
      /**
 * 🔥 GET UPDATED CHAT ROW (SINGLE CONVERSATION)
 */
        const [updatedRows] = await db.query(`
          SELECT
            cc.id,
            cc.conversation_id,
            cc.status,
            cc.is_user_online,
            cc.is_astrologer_online,
            cc.total_messages,
            cc.duration,
            cc.amount,
            cc.started_at,
            cc.last_message_at,

            u.id AS user_id,
            u.name AS user_name,
            u.profile_image,

            lm.message AS last_message,
            lm.message_type,
            lm.file_url,
            lm.sent_at AS message_time

          FROM chat_conversations cc

          LEFT JOIN users u ON u.id = cc.user_id

          LEFT JOIN chat_messages lm ON lm.id = (
            SELECT id
            FROM chat_messages
            WHERE conversation_id = cc.conversation_id
            ORDER BY id DESC
            LIMIT 1
          )

          WHERE cc.conversation_id = ?
          LIMIT 1
        `, [conversation_id]);
       const updatedConversation = updatedRows[0];
       io.to(`astrologer_${conversation.astrologer_id}`)
          .emit("chat_list_update", {
            type: "update_single",
            data: updatedConversation
          });

          console.log("updatedRows", updatedRows);

      // io.in("room_" + conversation_id).emit("receive_message", savedMessage);
      io.in("room_" + conversation_id).emit("receive_message", {
  ...savedMessage,
  file_url: savedMessage.file_url
    ? `${process.env.BASE_URL}/uploads/${savedMessage.file_url}`
    : null
});
    } catch (err) {
      console.log("Message Error:", err.message);
    }
  });

  /**
   * =========================================
   * SEEN MESSAGE
   * =========================================
   */
 socket.on("seen_messages", async (data, callback) => {
  try {
    const { conversation_id } = data;

    await db.query(
      `
      UPDATE chat_messages
      SET is_read = 1
      WHERE conversation_id = ?
      `,
      [conversation_id]
    );

    io.to("room_" + conversation_id).emit("messages_seen", {
      conversation_id
    });

    // ✅ ACK success response
    callback?.({
      success: true,
      message: "Messages marked as seen",
      conversation_id
    });

  } catch (err) {
    console.log("Seen Message Error:", err.message);

    // ❌ ACK error response
    callback?.({
      success: false,
      message: err.message
    });
  }
});

  /**
   * =========================================
   * LEAVE ROOM
   * =========================================
   */
 socket.on("leave_room", async (data) => {
   console.log("[LEAVE_ROOM] Event received:", data);
  try {
    const { conversation_id, sender_type } = data;

    socket.leave("room_" + conversation_id);

    /**
     * OFFLINE STATUS
     */
    if (sender_type === "user") {
      await db.query(
        `
        UPDATE chat_conversations
        SET is_user_online = 0
        WHERE conversation_id = ?
        `,
        [conversation_id]
      );
    } else {
      await db.query(
        `
        UPDATE chat_conversations
        SET is_astrologer_online = 0
        WHERE conversation_id = ?
        `,
        [conversation_id]
      );
    }

    /**
     * STOP TIMER
     */
    if (activeTimers[conversation_id]) {
      clearInterval(activeTimers[conversation_id]);
      delete activeTimers[conversation_id];

      await db.query(
        `
        UPDATE chat_conversations
        SET is_timer_running = 0
        WHERE conversation_id = ?
        `,
        [conversation_id]
      );
    }

    /**
     * END CHAT
     */
    await db.query(
      `
      UPDATE chat_conversations
      SET
        status = 'ended',
        ended_at = NOW(),
        updated_at = NOW()
      WHERE conversation_id = ?
      `,
      [conversation_id]
    );

    /**
     * ✅ ORDER UPDATE
     */
    await db.query(
      `
      UPDATE orders
      SET
        status = 'completed',
        end_time = NOW()
      WHERE conversation_id = ?
      `,
      [conversation_id]
    );

    /**
     * ASTROLOGER ONLINE
     */
    const [convRows] = await db.query(
      `
      SELECT astrologer_id, user_id
      FROM chat_conversations
      WHERE conversation_id = ?
      LIMIT 1
      `,
      [conversation_id]
    );

    if (convRows.length) {
      const astrologer_id = convRows[0].astrologer_id;
      const user_id = convRows[0].user_id;

      await setAstrologerOnlineStatus(io, astrologer_id, 1);

      console.log(`[CHAT ENDED] Astrologer ${astrologer_id} -> ONLINE`);

      /**
       * ✅ AGAR USER NE LEAVE KIYA
       * -> Astrologer ko notify karo
       */
      if (sender_type === "user") {
        io.to("room_" + conversation_id).emit("chat_ended", {
          success: true,
          ended_by: "user",
          message: "User ne chat end kar di"
        });

        // Astrologer ke personal room mein bhi bhejo
        io.to(`astrologer_${astrologer_id}`).emit("chat_ended", {
          success: true,
          ended_by: "user",
          conversation_id,
          message: "User ne chat end kar di"
        });

        await notifyPush({
          targetType: "astrologer",
          targetId: astrologer_id,
          title: "Chat ended by user",
          body: "User has left the chat.",
          data: {
            type: "chat_ended",
            conversation_id,
            ended_by: "user"
          }
        });

        console.log(`[LEAVE] User ${user_id} left -> Astrologer ${astrologer_id} notified`);
      }

      /**
       * ✅ AGAR ASTROLOGER NE LEAVE KIYA
       * -> User ko notify karo
       */
      if (sender_type === "astrologer") {
        io.to("room_" + conversation_id).emit("chat_ended", {
          success: true,
          ended_by: "astrologer",
          message: "Astrologer ne chat end kar di"
        });

        // User ke personal room mein bhi bhejo
        io.to(`user_${user_id}`).emit("chat_ended", {
          success: true,
          ended_by: "astrologer",
          conversation_id,
          message: "Astrologer ne chat end kar di"
        });

        await notifyPush({
          targetType: "user",
          targetId: user_id,
          title: "Chat ended by astrologer",
          body: "Astrologer has ended the chat.",
          data: {
            type: "chat_ended",
            conversation_id,
            ended_by: "astrologer"
          }
        });

        console.log(`[LEAVE] Astrologer ${astrologer_id} left -> User ${user_id} notified`);
      }
    }

  } catch (err) {
    console.log("Leave Room Error:", err.message);
  }
});

  /**
   * =========================================
   * DISCONNECT HANDLER FOR CHAT
   * =========================================
   */
  const handleChatDisconnect = async () => {
    const onlineUser = onlineUsers[socket.id];

    if (!onlineUser) {
      return;
    }

    const { conversation_id, sender_type, astrologer_id } = onlineUser;

    /**
     * STOP TIMER
     */
    if (activeTimers[conversation_id]) {
      clearInterval(activeTimers[conversation_id]);
      delete activeTimers[conversation_id];
    }

    /**
     * END CHAT
     */
    await db.query(
      `
      UPDATE chat_conversations
      SET
        status = 'ended',
        ended_at = NOW(),
        is_timer_running = 0
      WHERE conversation_id = ?
      `,
      [conversation_id]
    );

    await db.query(
`
UPDATE orders
SET
 status = 'completed',
 end_time = NOW()
WHERE conversation_id = ?
`,
[conversation_id]
);
    /**
     * ASTROLOGER ONLINE
     */
    const [convRows] = await db.query(
      `
      SELECT astrologer_id, user_id
      FROM chat_conversations
      WHERE conversation_id = ?
      LIMIT 1
      `,
      [conversation_id]
    );

    if (convRows.length) {
      // await db.query(
      //   `
      //   UPDATE astrologers
      //   SET chat_status = 'online'
      //   WHERE id = ?
      //   `,
      //   [convRows[0].astrologer_id]
      // );
if (sender_type === "astrologer" && astrologer_id) {

  await setAstrologerOnlineStatus(
    io,
    astrologer_id,
    0
  );

  console.log(
    `[DISCONNECT] Astrologer ${astrologer_id} -> OFFLINE`
  );

} else if (astrologer_id) {

  await setAstrologerOnlineStatus(
    io,
    astrologer_id,
    1
  );



  console.log(
    `[DISCONNECT] User left, Astrologer ${astrologer_id} -> ONLINE`
  );
}
  io.to("room_" + conversation_id).emit("chat_ended", {
  success: true,
  ended_by: sender_type,
  conversation_id,
  message: sender_type === "astrologer"
    ? "Astrologer disconnected"
    : "User disconnected"
});

  if (sender_type === "user") {
    await notifyPush({
      targetType: "astrologer",
      targetId: astrologer_id,
      title: "User disconnected",
      body: "User left the chat unexpectedly.",
      data: {
        type: "chat_ended",
        conversation_id,
        reason: "disconnect",
        ended_by: "user"
      }
    });
  } else if (sender_type === "astrologer") {
    await notifyPush({
      targetType: "user",
      targetId: convRows[0].user_id,
      title: "Astrologer disconnected",
      body: "Astrologer disconnected from the chat.",
      data: {
        type: "chat_ended",
        conversation_id,
        reason: "disconnect",
        ended_by: "astrologer"
      }
    });
  }
      // if (sender_type === "astrologer" && astrologer_id) {
      //   await setAstrologerOnlineStatus(io, astrologer_id, 0);
      // } else if (astrologer_id) {
      //   await setAstrologerOnlineStatus(io, astrologer_id, 1);
      // }
    }

    delete onlineUsers[socket.id];
  };

  return { handleChatDisconnect };
};

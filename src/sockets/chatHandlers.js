const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");
const { setAstrologerOnlineStatus } = require("./astrologerHandler");
// const { setAstrologerOnlineStatus, setAstrologerChatStatus } = require("./astrologerHandler");
const { sendNotification } = require("../config/notification");

const activeTimers = {};
const onlineUsers = {};

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
  socket.on("join_room", async (data) => {
    try {
      const { conversation_id, sender_type } = data;

      /**
       * ROOM VALIDATION
       */
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
        return;
      }

      socket.join("room_" + conversation_id);

      onlineUsers[socket.id] = {
        conversation_id,
        sender_type,
        astrologer_id: roomRows[0].astrologer_id,
        user_id: roomRows[0].user_id
      };

      /**
       * ONLINE STATUS
       */
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
    } catch (err) {
      console.log("Join Room Error:", err.message);
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
      await db.query(
        `
        UPDATE chat_conversations
        SET
          total_messages = total_messages + 1,
          last_message_at = NOW(),
          updated_at = NOW()
        WHERE conversation_id = ?
        `,
        [conversation_id]
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

              /**
               * SAFE WALLET DEDUCTION
               */
              const [walletUpdate] = await db.query(
                `
                UPDATE wallet
                SET balance = balance - ?
                WHERE user_id = ?
                AND balance >= ?
                `,
                [charge, conversation.user_id, charge]
              );

              /**
               * NO BALANCE
               */
              if (walletUpdate.affectedRows === 0) {
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

                /**
                 * ASTROLOGER ONLINE
                 */
                // await db.query(
                //   `
                //   UPDATE astrologers
                //   SET chat_status = 'online'
                //   WHERE id = ?
                //   `,
                //   [conversation.astrologer_id]
                // );
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

                return;
              }

              /**
               * WALLET HISTORY
               */
              await db.query(
                `
                INSERT INTO wallet_transactions
                (
                  user_id,
                  type,
                  amount,
                  reason,
                  created_at
                )
                VALUES
                (
                  ?, ?, ?, ?, NOW()
                )
                `,
                [conversation.user_id, "debit", charge, "Chat Consultation"]
              );

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
       * SEND MESSAGE
       */
      io.in("room_" + conversation_id).emit("receive_message", savedMessage);
    } catch (err) {
      console.log("Message Error:", err.message);
    }
  });

  /**
   * =========================================
   * SEEN MESSAGE
   * =========================================
   */
  socket.on("seen_messages", async (data) => {
    try {
      await db.query(
        `
        UPDATE chat_messages
        SET is_read = 1
        WHERE conversation_id = ?
        `,
        [data.conversation_id]
      );

      io.to("room_" + data.conversation_id).emit("messages_seen", {
        conversation_id: data.conversation_id
      });
    } catch (err) {
      console.log("Seen Message Error:", err.message);
    }
  });

  /**
   * =========================================
   * LEAVE ROOM
   * =========================================
   */
  socket.on("leave_room", async (data) => {
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
       * ASTROLOGER ONLINE
       */
      const [convRows] = await db.query(
        `
        SELECT astrologer_id
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

        // await setAstrologerOnlineStatus(io, convRows[0].astrologer_id, 1);
        await setAstrologerOnlineStatus(
  io,
  convRows[0].astrologer_id,
  1
);

console.log(
  `[CHAT ENDED] Astrologer ${convRows[0].astrologer_id} -> ONLINE`
);
      }

      io.to("room_" + conversation_id).emit("chat_ended", {
        success: true,
        message: "Chat ended"
      });
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

    /**
     * ASTROLOGER ONLINE
     */
    const [convRows] = await db.query(
      `
      SELECT astrologer_id
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

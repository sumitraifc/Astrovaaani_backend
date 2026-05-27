const { v4: uuidv4 } = require("uuid");
const db = require("../config/db");

const activeTimers = {};
const onlineUsers = {};

module.exports = (io) => {

  io.on("connection", (socket) => {

    console.log("Connected:", socket.id);

    /**
     * =========================================
     * CREATE CONVERSATION
     * =========================================
     */
    socket.on("create_conversation", async (data, callback) => {

      try {

        const {
          user_id,
          astrologer_id
        } = data;

        /**
         * UNIQUE CONVERSATION ID
         * 1_2_1716799999999
         */
        const firstId =
          Math.min(user_id, astrologer_id);

        const secondId =
          Math.max(user_id, astrologer_id);

        const uniqueKey =
          `${firstId}_${secondId}_${Date.now()}`;

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
            chat_charge
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
         * CHARGE PER MINUTE
         */
        const chargePerMin =
          Number(
            astroRows[0]?.chat_charge || 0
          );

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
          [
            uuidv4(),
            uniqueKey,
            user_id,
            astrologer_id,
            "active",
            chargePerMin,
            0,
            0
          ]
        );

        /**
         * GET CONVERSATION
         * WITH USER + ASTROLOGER NAME
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

        const conversation =
          conversationRows[0];

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

        const walletBalance =
          Number(
            walletRows[0]?.balance || 0
          );

        /**
         * JOIN ROOM
         */
        socket.join(
          "room_" + conversation.conversation_id
        );

        /**
         * STORE ONLINE USER
         */
        onlineUsers[socket.id] = {
          conversation_id:
            conversation.conversation_id
        };

        callback({
          success: true,
          conversation_id:
            conversation.conversation_id,
          wallet_balance:
            walletBalance,
          conversation
        });

      } catch (err) {

        console.log(
          "Conversation Error:",
          err.message
        );

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

        const {
          conversation_id,
          sender_type
        } = data;

        socket.join(
          "room_" + conversation_id
        );

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

        io.to(
          "room_" + conversation_id
        ).emit(
          "user_joined",
          {
            sender_type,
            conversation_id
          }
        );

      } catch (err) {

        console.log(err.message);
      }
    });

    /**
     * =========================================
     * TYPING
     * =========================================
     */
    socket.on("typing", (data) => {

      socket.to(
        "room_" + data.conversation_id
      ).emit(
        "typing",
        {
          sender_type:
            data.sender_type
        }
      );
    });

    /**
     * =========================================
     * STOP TYPING
     * =========================================
     */
    socket.on("stop_typing", (data) => {

      socket.to(
        "room_" + data.conversation_id
      ).emit(
        "stop_typing"
      );
    });

    /**
     * =========================================
     * SEND MESSAGE
     * =========================================
     */
    socket.on("send_message", async (data) => {

      try {

        const {
          conversation_id,
          sender_type,
          sender_id,
          message,
          message_type,
          file_url
        } = data;

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

        const savedMessage =
          messageRows[0];

        /**
         * UPDATE CONVERSATION
         */
        await db.query(
          `
          UPDATE chat_conversations
          SET
            total_messages =
              total_messages + 1,

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
          SELECT
            cc.*,

            u.name AS user_name,

            a.name AS astrologer_name

          FROM chat_conversations cc

          LEFT JOIN users u
            ON u.id = cc.user_id

          LEFT JOIN astrologers a
            ON a.id = cc.astrologer_id

          WHERE cc.conversation_id = ?
          LIMIT 1
          `,
          [conversation_id]
        );

        if (!conversationRows.length) {
          return;
        }

        const conversation =
          conversationRows[0];

        /**
         * START TIMER
         * ONLY AFTER ASTROLOGER MESSAGE
         */
        if (
          sender_type === "astrologer" &&
          !activeTimers[conversation_id]
        ) {

          console.log(
            "Timer Started:",
            conversation_id
          );

          activeTimers[conversation_id] =
            setInterval(async () => {

              try {

                /**
                 * GET LIVE WALLET
                 */
                const [walletRows] =
                  await db.query(
                    `
                    SELECT balance
                    FROM wallet
                    WHERE user_id = ?
                    LIMIT 1
                    `,
                    [conversation.user_id]
                  );

                const walletBalance =
                  Number(
                    walletRows[0]?.balance || 0
                  );

                /**
                 * GET LIVE CHARGE
                 */
                const [chargeRows] =
                  await db.query(
                    `
                    SELECT charge_per_min
                    FROM chat_conversations
                    WHERE conversation_id = ?
                    LIMIT 1
                    `,
                    [conversation_id]
                  );

                const charge =
                  Number(
                    chargeRows[0]
                      ?.charge_per_min || 0
                  );

                console.log(
                  "Wallet Balance:",
                  walletBalance
                );

                console.log(
                  "Charge:",
                  charge
                );

                /**
                 * IF CHARGE INVALID
                 */
                if (charge <= 0) {

                  console.log(
                    "Charge per minute is 0"
                  );

                  return;
                }

                /**
                 * LOW BALANCE
                 */
                if (
                  walletBalance <= charge
                ) {

                  io.to(
                    "room_" + conversation_id
                  ).emit(
                    "low_balance",
                    {
                      balance:
                        walletBalance
                    }
                  );
                }

                /**
                 * END CHAT
                 */
                if (
                  walletBalance < charge
                ) {

                  clearInterval(
                    activeTimers[
                      conversation_id
                    ]
                  );

                  delete activeTimers[
                    conversation_id
                  ];

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

                  io.to(
                    "room_" + conversation_id
                  ).emit(
                    "chat_ended",
                    {
                      success: false,
                      message:
                        "Insufficient balance"
                    }
                  );

                  return;
                }

                /**
                 * DEDUCT WALLET
                 */
                await db.query(
                  `
                  UPDATE wallet
                  SET balance = balance - ?
                  WHERE user_id = ?
                  `,
                  [
                    charge,
                    conversation.user_id
                  ]
                );

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
                  [
                    conversation.user_id,
                    "debit",
                    charge,
                    "Chat Consultation"
                  ]
                );

                /**
                 * UPDATE CHAT
                 * duration = total minutes
                 * amount = total amount
                 */
                await db.query(
                  `
                  UPDATE chat_conversations
                  SET
                    amount =
                      amount + ?,

                    duration =
                      duration + 1,

                    updated_at = NOW()

                  WHERE conversation_id = ?
                  `,
                  [
                    charge,
                    conversation_id
                  ]
                );

                /**
                 * UPDATED WALLET
                 */
                const [updatedWallet] =
                  await db.query(
                    `
                    SELECT balance
                    FROM wallet
                    WHERE user_id = ?
                    LIMIT 1
                    `,
                    [conversation.user_id]
                  );

                /**
                 * EMIT UPDATED BALANCE
                 */
                io.to(
                  "room_" + conversation_id
                ).emit(
                  "wallet_updated",
                  {
                    deducted: charge,

                    remaining_balance:
                      Number(
                        updatedWallet[0]
                          ?.balance || 0
                      )
                  }
                );

                console.log(
                  "Amount Deducted Successfully"
                );

              } catch (err) {

                console.log(
                  "Timer Error:",
                  err.message
                );
              }

            }, 60000);
        }

        /**
         * SEND MESSAGE
         */
        io.in(
          "room_" + conversation_id
        ).emit(
          "receive_message",
          savedMessage
        );

      } catch (err) {

        console.log(
          "Message Error:",
          err.message
        );
      }
    });

    /**
     * =========================================
     * SEEN MESSAGE
     * =========================================
     */
    socket.on(
      "seen_messages",
      async (data) => {

        try {

          await db.query(
            `
            UPDATE chat_messages
            SET is_read = 1
            WHERE conversation_id = ?
            `,
            [data.conversation_id]
          );

          io.to(
            "room_" +
            data.conversation_id
          ).emit(
            "messages_seen",
            {
              conversation_id:
                data.conversation_id
            }
          );

        } catch (err) {

          console.log(err.message);
        }
      }
    );

    /**
     * =========================================
     * LEAVE ROOM
     * =========================================
     */
    socket.on(
      "leave_room",
      async (data) => {

        try {

          const {
            conversation_id,
            sender_type
          } = data;

          socket.leave(
            "room_" + conversation_id
          );

          /**
           * OFFLINE STATUS
           */
          if (
            sender_type === "user"
          ) {

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
          if (
            activeTimers[
              conversation_id
            ]
          ) {

            clearInterval(
              activeTimers[
                conversation_id
              ]
            );

            delete activeTimers[
              conversation_id
            ];
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

          io.to(
            "room_" + conversation_id
          ).emit(
            "chat_ended",
            {
              success: true,
              message: "Chat ended"
            }
          );

        } catch (err) {

          console.log(err.message);
        }
      }
    );

    /**
     * =========================================
     * DISCONNECT
     * =========================================
     */
    socket.on("disconnect", () => {

      console.log(
        "Disconnected:",
        socket.id
      );

      delete onlineUsers[socket.id];
    });

  });

};
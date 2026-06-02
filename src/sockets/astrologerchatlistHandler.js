socket.on(
  "astrologer_chat_list",
  async (data, callback) => {

    console.log("\n=================================");
    console.log("ASTROLOGER CHAT LIST EVENT HIT");
    console.log("Incoming Data:", data);
    console.log("=================================\n");

    try {

      const { astrologer_id } = data;

      console.log(
        "[STEP 1] Astrologer ID Received:",
        astrologer_id
      );

      if (!astrologer_id) {

        console.log(
          "[ERROR] astrologer_id is missing"
        );

        return callback({
          success: false,
          message: "astrologer_id is required"
        });
      }

      console.log(
        "[STEP 2] Fetching chat list from database..."
      );

      const [rows] = await db.query(`
        SELECT
          cc.id,
          cc.conversation_id,
          cc.status,
          cc.is_user_online,
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
          lm.sent_at AS message_time,

          (
            SELECT COUNT(*)
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
            AND cm.sender_type = 'user'
            AND cm.is_read = 0
          ) AS unread_count

        FROM chat_conversations cc

        INNER JOIN users u
          ON u.id = cc.user_id

        LEFT JOIN chat_messages lm
          ON lm.id = (
            SELECT id
            FROM chat_messages
            WHERE conversation_id = cc.conversation_id
            ORDER BY id DESC
            LIMIT 1
          )

        WHERE cc.astrologer_id = ?

        ORDER BY
          COALESCE(lm.sent_at, cc.created_at) DESC
      `, [astrologer_id]);

      console.log(
        "[STEP 3] Query Executed Successfully"
      );

      console.log(
        "[STEP 4] Total Conversations Found:",
        rows.length
      );

      if (rows.length > 0) {

        console.log(
          "[STEP 5] First Conversation Preview:"
        );

        console.log(
          JSON.stringify(rows[0], null, 2)
        );

      } else {

        console.log(
          "[INFO] No conversations found"
        );
      }

      console.log(
        "[STEP 6] Sending response to frontend"
      );

      callback({
        success: true,
        total: rows.length,
        data: rows
      });

      console.log(
        "[SUCCESS] Chat list sent successfully"
      );

    } catch (error) {

      console.log("\n=================================");
      console.log("ASTROLOGER CHAT LIST ERROR");
      console.log("Message:", error.message);
      console.log("Stack:", error.stack);
      console.log("=================================\n");

      callback({
        success: false,
        message: error.message
      });
    }
  }
);
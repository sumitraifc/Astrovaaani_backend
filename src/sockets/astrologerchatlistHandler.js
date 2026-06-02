const db = require("../config/db");

module.exports = (io, socket) => {

  console.log("🔥 astrologerchatlistHandler LOADED");

  /**
   * DEBUG: catch ALL events for this socket
   */
  socket.onAny((event, data) => {
    console.log("📩 [SOCKET EVENT RECEIVED]", event, data);
  });

  socket.on("astrologer_chat_list", async (data, callback) => {

    console.log("\n=================================");
    console.log("🔥 ASTROLOGER CHAT LIST EVENT HIT");
    console.log("Socket ID:", socket.id);
    console.log("Incoming Data:", data);
    console.log("=================================\n");

    try {

      const astrologer_id = Number(data?.astrologer_id);

      console.log("[STEP 1] Astrologer ID:", astrologer_id);

      if (!astrologer_id) {

        console.log("[ERROR] astrologer_id missing");

        return callback?.({
          success: false,
          message: "astrologer_id is required"
        });
      }

      console.log("[STEP 2] Running DB Query...");

      const [rows] = await db.query(
        `
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
          lm.sent_at AS message_time,

          (
            SELECT COUNT(*)
            FROM chat_messages cm
            WHERE cm.conversation_id = cc.conversation_id
            AND cm.sender_type = 'user'
            AND cm.is_read = 0
          ) AS unread_count

        FROM chat_conversations cc

        LEFT JOIN users u
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

        ORDER BY cc.last_message_at DESC
        `,
        [astrologer_id]
      );

      console.log("[STEP 3] DB Query Success");
      console.log("[STEP 4] Rows Count:", rows.length);

      if (!rows || rows.length === 0) {
        console.log("⚠️ NO CHAT FOUND FOR ASTROLOGER:", astrologer_id);
      } else {
        console.log("[STEP 5] Sample Row:");
        console.log(JSON.stringify(rows[0], null, 2));
      }

      console.log("[STEP 6] Sending response...");

      if (typeof callback === "function") {

        return callback({
          success: true,
          total: rows.length,
          data: rows
        });

      } else {
        console.log("❌ CALLBACK NOT FUNCTION");
      }

      console.log("✅ RESPONSE SENT SUCCESSFULLY");

    } catch (error) {

      console.log("\n=================================");
      console.log("❌ ASTROLOGER CHAT LIST ERROR");
      console.log("Message:", error.message);
      console.log("Stack:", error.stack);
      console.log("=================================\n");

      if (typeof callback === "function") {
        callback({
          success: false,
          message: error.message
        });
      }

    }
  });

};
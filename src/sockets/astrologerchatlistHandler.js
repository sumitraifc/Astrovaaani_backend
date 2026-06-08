const db = require("../config/db");

module.exports = (io, socket) => {

  console.log("🔥 astrologerchatlistHandler LOADED");
  console.log("🆔 Socket Connected:", socket.id);

  /* =========================================
     🔥 GLOBAL EVENT LISTENER (ALL EVENTS TRACK)
  ========================================= */
  socket.onAny((event, ...args) => {

    console.log("\n==============================");
    console.log("📩 SOCKET EVENT HIT (ANY)");
    console.log("Socket ID:", socket.id);
    console.log("Event Name:", event);
    console.log("Args:", args);
    console.log("==============================\n");

    socket.emit("debug:event_received", {
      event,
      args
    });
  });

  /* =========================================
     👀 TEST CONNECT CONFIRM EVENT
  ========================================= */
  socket.on("ping", (data, cb) => {

    console.log("📡 PING RECEIVED:", data);

    cb?.({
      success: true,
      message: "pong from server",
      socket_id: socket.id
    });
  });

  /* =========================================
     📥 ASTROLOGER CHAT LIST
  ========================================= */
  socket.on("astrologer_chat_list", async (data = {}, callback) => {

    console.log("\n=================================");
    console.log("🔥 ASTROLOGER CHAT LIST EVENT HIT");
    console.log("Socket ID:", socket.id);
    console.log("Data:", data);
    console.log("=================================\n");

    try {

      const astrologer_id = Number(data.astrologer_id);

      console.log("✅ Parsed astrologer_id:", astrologer_id);

      if (!astrologer_id) {
        return callback?.({
          success: false,
          message: "astrologer_id is required"
        });
      }

      /* =========================================
         🔥 JOIN ROOM (PER ASTROLOGER)
      ========================================= */
      const room = `astrologer_${astrologer_id}`;

      socket.join(room);

      console.log(`🟢 JOINED ROOM: ${room}`);

      /* =========================================
         📥 DB QUERY
         ONE USER ONLY ONCE
      ========================================= */
  const [rows] = await db.query(`
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
    AND cc.id = (
      SELECT MAX(c2.id)
      FROM chat_conversations c2
      WHERE c2.user_id = cc.user_id
        AND c2.astrologer_id = cc.astrologer_id
    )

  ORDER BY cc.last_message_at DESC
`, [astrologer_id]);

      console.log("📊 Total Unique Users:", rows.length);

      const response = {
        success: true,
        total: rows.length,
        data: rows
      };

      /* =========================================
         📤 CALLBACK RESPONSE
      ========================================= */
      callback?.(response);

      /* =========================================
         🔥 ROOM EMIT
      ========================================= */
      io.to(room).emit(
        "astrologer_chat_list_response",
        response
      );

      console.log("📡 ROOM EMIT SENT:", room);

    } catch (error) {

      console.log("❌ ERROR:", error);

      callback?.({
        success: false,
        message: error.message
      });
    }
  });

  /* =========================================
     🔌 DISCONNECT TRACK
  ========================================= */
  socket.on("disconnect", (reason) => {

    console.log("\n❌ SOCKET DISCONNECTED");
    console.log("Socket ID:", socket.id);
    console.log("Reason:", reason);
  });

  /* =========================================
     🧪 MANUAL TEST EVENT
  ========================================= */
  socket.on("test_event", (data, cb) => {

    console.log("🧪 TEST EVENT:", data);

    cb?.({
      success: true,
      message: "test working fine",
      data
    });
  });
};
const db = require("../config/db");

module.exports = (io, socket) => {

  // =========================================
  // START LIVE
  // Astrologer live shuru karta hai
  // =========================================
  socket.on("start_live", async (data, callback) => {
    try {
      const { astrologer_id, title } = data;

      // Pehle check karo — already live toh nahi?
      const [existing] = await db.query(
        `SELECT id FROM live_streams
         WHERE astrologer_id = ? AND status = 'live' LIMIT 1`,
        [astrologer_id]
      );

      if (existing.length) {
        return callback?.({ success: false, message: "Already live" });
      }

      // Unique stream key
      const streamKey = `live_${astrologer_id}_${Date.now()}`;

      const [result] = await db.query(
        `INSERT INTO live_streams
         (astrologer_id, title, stream_key, status, started_at, created_at)
         VALUES (?, ?, ?, 'live', NOW(), NOW())`,
        [astrologer_id, title || "Live Session", streamKey]
      );

      const stream_id = result.insertId;

      // Astrologer apne personal room mein join karo
      socket.join(`live_${stream_id}`);
      socket.join(`astrologer_${astrologer_id}`);

      // Sabko broadcast — astrologer live aa gaya
      io.emit("astrologer_went_live", {
        stream_id,
        astrologer_id,
        title: title || "Live Session",
        stream_key: streamKey
      });

      console.log(`[LIVE STARTED] Astrologer ${astrologer_id} -> stream_id: ${stream_id}`);

      callback?.({
        success: true,
        stream_id,
        stream_key: streamKey
      });

    } catch (err) {
      console.log("Start Live Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // JOIN LIVE
  // User live stream mein join karta hai
  // =========================================
  socket.on("join_live", async (data, callback) => {
    try {
      const { stream_id, user_id } = data;

      // Stream exist karta hai?
      const [streamRows] = await db.query(
        `SELECT id, astrologer_id, title, viewer_count, total_likes, status
         FROM live_streams WHERE id = ? LIMIT 1`,
        [stream_id]
      );

      if (!streamRows.length || streamRows[0].status !== "live") {
        return callback?.({ success: false, message: "Stream not found or ended" });
      }

      const stream = streamRows[0];

      // Socket room join
      socket.join(`live_${stream_id}`);

      // Viewer record insert/update
      const [existingViewer] = await db.query(
        `SELECT id FROM live_viewers
         WHERE stream_id = ? AND user_id = ? LIMIT 1`,
        [stream_id, user_id]
      );

      if (existingViewer.length) {
        await db.query(
          `UPDATE live_viewers
           SET is_active = 1, joined_at = NOW(), left_at = NULL
           WHERE stream_id = ? AND user_id = ?`,
          [stream_id, user_id]
        );
      } else {
        await db.query(
          `INSERT INTO live_viewers (stream_id, user_id, joined_at, is_active)
           VALUES (?, ?, NOW(), 1)`,
          [stream_id, user_id]
        );
      }

      // Viewer count update
      await db.query(
        `UPDATE live_streams
         SET viewer_count = (
           SELECT COUNT(*) FROM live_viewers
           WHERE stream_id = ? AND is_active = 1
         ) WHERE id = ?`,
        [stream_id, stream_id]
      );

      // Updated viewer count
      const [updated] = await db.query(
        `SELECT viewer_count FROM live_streams WHERE id = ?`,
        [stream_id]
      );

      // User name fetch for join notification
      const [userRows] = await db.query(
        `SELECT name FROM users WHERE id = ? LIMIT 1`,
        [user_id]
      );

      // Room mein sabko viewer count update bhejo
      io.to(`live_${stream_id}`).emit("viewer_count_updated", {
        stream_id,
        viewer_count: updated[0].viewer_count
      });

      // User joined notification
      io.to(`live_${stream_id}`).emit("user_joined_live", {
        stream_id,
        user_id,
        user_name: userRows[0]?.name || "Someone",
        viewer_count: updated[0].viewer_count
      });

      // Purani comments fetch karo (last 50)
      const [comments] = await db.query(
        `SELECT
           lc.id, lc.message, lc.created_at,
           u.name AS user_name, u.profile_image
         FROM live_comments lc
         JOIN users u ON u.id = lc.user_id
         WHERE lc.stream_id = ? AND lc.is_deleted = 0
         ORDER BY lc.created_at DESC LIMIT 50`,
        [stream_id]
      );

      callback?.({
        success: true,
        stream_id,
        stream: {
          id: stream.id,
          astrologer_id: stream.astrologer_id,
          title: stream.title,
          viewer_count: updated[0].viewer_count,
          total_likes: stream.total_likes
        },
        recent_comments: comments.reverse()
      });

    } catch (err) {
      console.log("Join Live Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // LEAVE LIVE
  // User live se bahar jaata hai
  // =========================================
  socket.on("leave_live", async (data) => {
    try {
      const { stream_id, user_id } = data;

      socket.leave(`live_${stream_id}`);

      await db.query(
        `UPDATE live_viewers
         SET is_active = 0, left_at = NOW()
         WHERE stream_id = ? AND user_id = ?`,
        [stream_id, user_id]
      );

      await db.query(
        `UPDATE live_streams
         SET viewer_count = (
           SELECT COUNT(*) FROM live_viewers
           WHERE stream_id = ? AND is_active = 1
         ) WHERE id = ?`,
        [stream_id, stream_id]
      );

      const [updated] = await db.query(
        `SELECT viewer_count FROM live_streams WHERE id = ?`,
        [stream_id]
      );

      io.to(`live_${stream_id}`).emit("viewer_count_updated", {
        stream_id,
        viewer_count: updated[0]?.viewer_count || 0
      });

    } catch (err) {
      console.log("Leave Live Error:", err.message);
    }
  });

  // =========================================
  // SEND COMMENT
  // User comment karta hai
  // =========================================
  socket.on("send_live_comment", async (data, callback) => {
    try {
      const { stream_id, user_id, message } = data;

      if (!message?.trim()) {
        return callback?.({ success: false, message: "Message required" });
      }

      // Stream active hai?
      const [streamRows] = await db.query(
        `SELECT id FROM live_streams WHERE id = ? AND status = 'live' LIMIT 1`,
        [stream_id]
      );

      if (!streamRows.length) {
        return callback?.({ success: false, message: "Stream not active" });
      }

      // Comment save karo
      const [result] = await db.query(
        `INSERT INTO live_comments (stream_id, user_id, message, created_at)
         VALUES (?, ?, ?, NOW())`,
        [stream_id, user_id, message.trim()]
      );

      // User details
      const [userRows] = await db.query(
        `SELECT name, profile_image FROM users WHERE id = ? LIMIT 1`,
        [user_id]
      );

      const comment = {
        id: result.insertId,
        stream_id,
        user_id,
        user_name: userRows[0]?.name || "User",
        profile_image: userRows[0]?.profile_image
          ? `${process.env.BASE_URL}/uploads/${userRows[0].profile_image}`
          : null,
        message: message.trim(),
        created_at: new Date()
      };

      // Poore room mein broadcast
      io.to(`live_${stream_id}`).emit("new_live_comment", comment);

      callback?.({ success: true, comment });

    } catch (err) {
      console.log("Live Comment Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // SEND LIKE
  // User like karta hai (sirf ek baar)
  // =========================================
  socket.on("send_live_like", async (data, callback) => {
    try {
      const { stream_id, user_id } = data;

      // Duplicate like check (INSERT IGNORE)
      const [result] = await db.query(
        `INSERT IGNORE INTO live_likes (stream_id, user_id, created_at)
         VALUES (?, ?, NOW())`,
        [stream_id, user_id]
      );

      if (result.affectedRows === 0) {
        return callback?.({ success: false, message: "Already liked" });
      }

      // Total likes update
      await db.query(
        `UPDATE live_streams SET total_likes = total_likes + 1 WHERE id = ?`,
        [stream_id]
      );

      const [updated] = await db.query(
        `SELECT total_likes FROM live_streams WHERE id = ?`,
        [stream_id]
      );

      const [userRows] = await db.query(
        `SELECT name FROM users WHERE id = ? LIMIT 1`,
        [user_id]
      );

      // Room mein sabko broadcast
      io.to(`live_${stream_id}`).emit("live_liked", {
        stream_id,
        user_id,
        user_name: userRows[0]?.name || "User",
        total_likes: updated[0].total_likes
      });

      callback?.({ success: true, total_likes: updated[0].total_likes });

    } catch (err) {
      console.log("Live Like Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // SEND GIFT (Wallet se amount)
  // User astrologer ko gift deta hai
  // =========================================
  socket.on("send_live_gift", async (data, callback) => {
    try {
      const { stream_id, user_id, astrologer_id, amount, message } = data;

      if (!amount || Number(amount) <= 0) {
        return callback?.({ success: false, message: "Invalid amount" });
      }

      const giftAmount = Number(amount);

      // Stream active check
      const [streamRows] = await db.query(
        `SELECT id FROM live_streams WHERE id = ? AND status = 'live' LIMIT 1`,
        [stream_id]
      );

      if (!streamRows.length) {
        return callback?.({ success: false, message: "Stream not active" });
      }

      // Wallet balance check
      const [walletRows] = await db.query(
        `SELECT balance FROM wallet WHERE user_id = ? LIMIT 1`,
        [user_id]
      );

      const walletBalance = Number(walletRows[0]?.balance || 0);

      if (walletBalance < giftAmount) {
        return callback?.({
          success: false,
          message: `Insufficient balance. Available: ₹${walletBalance}`
        });
      }

      // Wallet deduct (safe)
      const [walletUpdate] = await db.query(
        `UPDATE wallet SET balance = balance - ?
         WHERE user_id = ? AND balance >= ?`,
        [giftAmount, user_id, giftAmount]
      );

      if (walletUpdate.affectedRows === 0) {
        return callback?.({ success: false, message: "Wallet deduction failed" });
      }

      // Wallet transaction record
      const [txnResult] = await db.query(
        `INSERT INTO wallet_transactions
         (user_id, type, amount, reason, created_at)
         VALUES (?, 'debit', ?, ?, NOW())`,
        [user_id, giftAmount, `Live gift to astrologer ${astrologer_id}`]
      );

      // Gift record save
      const [giftResult] = await db.query(
        `INSERT INTO live_gifts
         (stream_id, user_id, astrologer_id, amount, message, wallet_txn_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [stream_id, user_id, astrologer_id, giftAmount, message || null, txnResult.insertId]
      );

      // User details
      const [userRows] = await db.query(
        `SELECT name, profile_image FROM users WHERE id = ? LIMIT 1`,
        [user_id]
      );

      // Updated wallet
      const [updatedWallet] = await db.query(
        `SELECT balance FROM wallet WHERE user_id = ? LIMIT 1`,
        [user_id]
      );

      const giftData = {
        id: giftResult.insertId,
        stream_id,
        user_id,
        user_name: userRows[0]?.name || "User",
        profile_image: userRows[0]?.profile_image
          ? `${process.env.BASE_URL}/uploads/${userRows[0].profile_image}`
          : null,
        astrologer_id,
        amount: giftAmount,
        message: message || null,
        created_at: new Date()
      };

      // Poore room mein gift event broadcast
      io.to(`live_${stream_id}`).emit("live_gift_received", giftData);

      callback?.({
        success: true,
        gift: giftData,
        remaining_balance: Number(updatedWallet[0]?.balance || 0)
      });

    } catch (err) {
      console.log("Live Gift Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // END LIVE
  // Astrologer stream band karta hai
  // =========================================
  socket.on("end_live", async (data, callback) => {
    try {
      const { stream_id, astrologer_id } = data;

      await db.query(
        `UPDATE live_streams
         SET status = 'ended', ended_at = NOW()
         WHERE id = ? AND astrologer_id = ?`,
        [stream_id, astrologer_id]
      );

      // Saare viewers ko mark karo inactive
      await db.query(
        `UPDATE live_viewers SET is_active = 0, left_at = NOW()
         WHERE stream_id = ? AND is_active = 1`,
        [stream_id]
      );

      // Final stats
      const [stats] = await db.query(
        `SELECT
           viewer_count, total_likes,
           (SELECT COUNT(*) FROM live_comments WHERE stream_id = ? AND is_deleted = 0) AS total_comments,
           (SELECT COALESCE(SUM(amount),0) FROM live_gifts WHERE stream_id = ?) AS total_gifts
         FROM live_streams WHERE id = ?`,
        [stream_id, stream_id, stream_id]
      );

      const finalStats = stats[0];

      // Poore room ko notify karo
      io.to(`live_${stream_id}`).emit("live_ended", {
        stream_id,
        astrologer_id,
        stats: finalStats,
        message: "Stream has ended"
      });

      console.log(`[LIVE ENDED] stream_id: ${stream_id}, stats:`, finalStats);

      callback?.({ success: true, stats: finalStats });

    } catch (err) {
      console.log("End Live Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // GET LIVE STATS
  // Viewer count, likes, comments realtime
  // =========================================
  socket.on("get_live_stats", async (data, callback) => {
    try {
      const { stream_id } = data;

      const [rows] = await db.query(
        `SELECT
           ls.id, ls.title, ls.status,
           ls.viewer_count, ls.total_likes,
           ls.started_at,
           a.name AS astrologer_name,
           a.profile_image AS astrologer_image,
           (SELECT COUNT(*) FROM live_comments WHERE stream_id = ls.id AND is_deleted = 0) AS total_comments,
           (SELECT COALESCE(SUM(amount),0) FROM live_gifts WHERE stream_id = ls.id) AS total_gifts
         FROM live_streams ls
         JOIN astrologers a ON a.id = ls.astrologer_id
         WHERE ls.id = ? LIMIT 1`,
        [stream_id]
      );

      if (!rows.length) {
        return callback?.({ success: false, message: "Stream not found" });
      }

      callback?.({ success: true, data: rows[0] });

    } catch (err) {
      console.log("Get Stats Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // DISCONNECT HANDLER
  // =========================================
  const handleLiveDisconnect = async () => {
    // Koi active live_viewers rows hain is socket ke liye?
    // (socket.id se user_id track karna padega — register event mein store karo)
  };

  return { handleLiveDisconnect };
};
const db = require("../config/db");
const liveService = require("../modules/live/service");
const { settleConsultationCharge } = require("../utils/settlement");

/**
 * Socket se connected live users track karo
 * Format: { socketId: { user_id, stream_id, role } }
 */
const liveSocketUsers = {};

module.exports = (io, socket) => {

  // =========================================
  // START LIVE
  // Astrologer "Go Live" click karta hai
  // Flow: Socket → Service → Agora token + DB
  // =========================================
 socket.on("start_live", async (data, callback) => {
  try {
    const { astrologer_id, title } = data;

    console.log(`[START LIVE] Astrologer ${astrologer_id}`);

    // Service se Agora token + DB insert
    const tokenData = await liveService.generateLiveToken({
      astrologer_id,
      title
    });

    const stream_id = tokenData.stream_id;

    // Socket rooms join
    socket.join(`live_${stream_id}`);
    socket.join(`astrologer_${astrologer_id}`);

    // Track karo
    liveSocketUsers[socket.id] = {
      user_id: astrologer_id,
      stream_id,
      role: "astrologer"
    };

    // ✅ Astrologer details fetch karo broadcast ke liye
    const [astroDetails] = await db.query(
      `SELECT name, profile_image, expertise
       FROM astrologers WHERE id = ? LIMIT 1`,
      [astrologer_id]
    );

    const astroData = astroDetails[0];

    // ✅ Sabko broadcast — astrologer live aa gaya
    // all_streams mein add ho jaye frontend pe
    io.emit("astrologer_went_live", {
      stream_id,
      astrologer_id,
      title: title || "Live Session",
      stream_key: tokenData.stream_key,
      channel_name: tokenData.channel_name,
      viewer_count: 0,
      total_likes: 0,

      // ✅ Ye details all_streams mein save hongi
      astrologer_name: astroData?.name || null,
      astrologer_image: astroData?.profile_image
        ? `${process.env.BASE_URL}/uploads/${astroData.profile_image}`
        : null,
      expertise: astroData?.expertise || null
    });

    console.log(`[LIVE STARTED] stream_id: ${stream_id}`);

    // ✅ Astrologer ko Agora details + ACK
    callback?.({
      success: true,
      message: "Live started successfully",
      stream_id,
      stream_key: tokenData.stream_key,

      // Agora details — frontend SDK ke liye
      agora_app_id: tokenData.appId,
      agora_token: tokenData.astrologer_token,
      channel_name: tokenData.channel_name,
      uid: tokenData.astrologer_uid,
      role: "broadcaster",

      // Stream info
      stream_info: {
        stream_id,
        astrologer_id,
        title: title || "Live Session",
        started_at: new Date()
      }
    });

  } catch (err) {
    console.log("Start Live Error:", err.message);
    callback?.({ success: false, message: err.message });
  }
});

  // =========================================
// GET FIRST LIVE
// "See Live" button click — auto join
// =========================================
socket.on("get_first_live", async (data, callback) => {
    console.log("GET_FIRST_LIVE DATA =>", data);
  try {
    const { user_id } = data;

    const [rows] = await db.query(
      `SELECT
        ls.id AS stream_id,
        ls.astrologer_id,
        ls.title,
        ls.stream_key,
        ls.viewer_count,
        ls.total_likes,
        ls.started_at,
        a.name AS astrologer_name,
        a.profile_image AS astrologer_image,
        a.expertise
      FROM live_streams ls
      JOIN astrologers a ON a.id = ls.astrologer_id
      WHERE ls.status = 'live'
        AND ls.astrologer_id NOT IN (
          SELECT blocked_astrologer_id FROM blocks
          WHERE blocker_user_id = ? AND blocked_astrologer_id IS NOT NULL
          UNION
          SELECT blocker_astrologer_id FROM blocks
          WHERE blocked_user_id = ? AND blocker_astrologer_id IS NOT NULL
        )
      ORDER BY ls.viewer_count DESC`,
      [user_id, user_id]
    );

    if (!rows.length) {
      return callback?.({
        success: false,
        message: "No live streams right now",
        data: null
      });
    }

    // ✅ Har stream ke liye — token + comments sab ek saath
    const allLivesWithTokens = await Promise.all(
      rows.map(async (stream) => {
        try {
          // Agora token generate karo
          const tokenData = await liveService.generateViewerToken({
            user_id,
            stream_id: stream.stream_id
          });

          // Har stream ke last 50 comments fetch karo
          const [comments] = await db.query(
            `SELECT
               lc.id, lc.message, lc.created_at,
               u.name AS user_name,
               u.profile_image
             FROM live_comments lc
             JOIN users u ON u.id = lc.user_id
             WHERE lc.stream_id = ? AND lc.is_deleted = 0
             ORDER BY lc.created_at DESC LIMIT 50`,
            [stream.stream_id]
          );

          // Comments mein profile_image ka full URL banao
          const formattedComments = comments.map(c => ({
            id: c.id,
            message: c.message,
            created_at: c.created_at,
            user_name: c.user_name,
            profile_image: c.profile_image
              ? `${process.env.BASE_URL}/uploads/${c.profile_image}`
              : null
          }));

          return {
            ...stream,
            // Astrologer image full URL
            astrologer_image: stream.astrologer_image
              ? `${process.env.BASE_URL}/uploads/${stream.astrologer_image}`
              : null,
            // Agora details — har stream ke ALAG
            agora_app_id: tokenData.appId,        // Same (ek Agora project)
            agora_token: tokenData.user_token,     // ✅ Alag
            channel_name: tokenData.channel_name,  // ✅ Alag
            uid: tokenData.user_uid,               // ✅ Alag
            role: "audience",
            // ✅ Us stream ke comments — name, pic, message sab
            recent_comments: formattedComments.reverse()
          };

        } catch (err) {
          console.log(`Stream ${stream.stream_id} error:`, err.message);
          return {
            ...stream,
            astrologer_image: stream.astrologer_image
              ? `${process.env.BASE_URL}/uploads/${stream.astrologer_image}`
              : null,
            agora_app_id: null,
            agora_token: null,
            channel_name: null,
            uid: null,
            role: "audience",
            recent_comments: []
          };
        }
      })
    );

    // Pehli stream (sabse zyada viewers)
    const firstStream = allLivesWithTokens[0];

    // ✅ Pehli stream mein viewer record insert/update karo
    // const [existingViewer] = await db.query(
    //   `SELECT id FROM live_viewers
    //    WHERE stream_id = ? AND user_id = ? LIMIT 1`,
    //   [firstStream.stream_id, user_id]
    // );

    // if (existingViewer.length) {
    //   await db.query(
    //     `UPDATE live_viewers
    //      SET is_active = 1, joined_at = NOW(), left_at = NULL
    //      WHERE stream_id = ? AND user_id = ?`,
    //     [firstStream.stream_id, user_id]
    //   );
    // } else {
    //   await db.query(
    //     `INSERT INTO live_viewers (stream_id, user_id, joined_at, is_active)
    //      VALUES (?, ?, NOW(), 1)`,
    //     [firstStream.stream_id, user_id]
    //   );
    // }

    // ✅ Viewer count update
    // await db.query(
    //   `UPDATE live_streams
    //    SET viewer_count = (
    //      SELECT COUNT(*) FROM live_viewers
    //      WHERE stream_id = ? AND is_active = 1
    //    ) WHERE id = ?`,
    //   [firstStream.stream_id, firstStream.stream_id]
    // );

    // const [updated] = await db.query(
    //   `SELECT viewer_count FROM live_streams WHERE id = ?`,
    //   [firstStream.stream_id]
    // );

    // ✅ all_streams[0] ka viewer_count real update karo
    // allLivesWithTokens[0].viewer_count = updated[0].viewer_count;

    // ✅ Socket room join
//     socket.join(`live_${firstStream.stream_id}`);
//     liveSocketUsers[socket.id] = {
//       user_id,
//       stream_id: firstStream.stream_id,
//       role: "user"
//     };

//     const alreadyTracked = liveSocketUsers[socket.id];
// if (!alreadyTracked || alreadyTracked.stream_id !== firstStream.stream_id) {
//   liveSocketUsers[socket.id] = {
//     user_id,
//     stream_id: firstStream.stream_id,
//     role: "user"
//   };
// }
    // ✅ Room ko viewer count emit karo
    // io.to(`live_${firstStream.stream_id}`).emit("viewer_count_updated", {
    //   stream_id: firstStream.stream_id,
    //   viewer_count: updated[0].viewer_count
    // });

    callback?.({
      success: true,
      // ✅ Sab kuch all_streams mein — har stream ke andar uska token + comments
      all_streams: allLivesWithTokens,
      total: allLivesWithTokens.length
    });

  } catch (err) {
    console.log("Get First Live Error:", err.message);
    callback?.({ success: false, message: err.message });
  }
});
  // =========================================
  // JOIN LIVE
  // User live stream join karta hai
  // Flow: Socket → Service → Agora viewer token
  // Emit change: ab agora_token bhi milega
  // =========================================
  socket.on("join_live", async (data, callback) => {
    try {
      const { stream_id, user_id } = data;

      console.log(`[JOIN LIVE] User ${user_id} -> Stream ${stream_id}`);

 const existing = liveSocketUsers[socket.id];
  if (existing && existing.stream_id === stream_id && existing.user_id === user_id) {
    console.log(`[JOIN LIVE] User ${user_id} already in stream ${stream_id}, skipping duplicate`);
    return callback?.({ success: false, message: "Already joined this stream" });
  }
      // Stream exist + active check
      const [streamRows] = await db.query(
        `SELECT id, astrologer_id, title, viewer_count, total_likes, status, stream_key
         FROM live_streams WHERE id = ? LIMIT 1`,
        [stream_id]
      );

      if (!streamRows.length || streamRows[0].status !== "live") {
        return callback?.({ success: false, message: "Stream not found or ended" });
      }

      const stream = streamRows[0];

      // ✅ Agora viewer token generate karo
      const tokenData = await liveService.generateViewerToken({
        user_id,
        stream_id
      });

      // Socket room join
      socket.join(`live_${stream_id}`);

      // Track karo
      liveSocketUsers[socket.id] = {
        user_id,
        stream_id,
        role: "user"
      };

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

      const [updated] = await db.query(
        `SELECT viewer_count FROM live_streams WHERE id = ?`,
        [stream_id]
      );

      const [userRows] = await db.query(
        `SELECT name FROM users WHERE id = ? LIMIT 1`,
        [user_id]
      );

      // Room mein viewer count update
      io.to(`live_${stream_id}`).emit("viewer_count_updated", {
        stream_id,
        viewer_count: updated[0].viewer_count
      });

      // Sabko — user joined
      io.to(`live_${stream_id}`).emit("user_joined_live", {
        stream_id,
        user_id,
        user_name: userRows[0]?.name || "Someone",
        viewer_count: updated[0].viewer_count
      });

      // Last 50 comments
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

        // ✅ Agora details — frontend SDK ke liye
        agora_app_id: tokenData.appId,
        agora_token: tokenData.user_token,
        channel_name: tokenData.channel_name,
        uid: tokenData.user_uid,
        role: "audience",

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
  // LEAVE LIVE — same as before, no change
  // =========================================
  socket.on("leave_live", async (data) => {
    try {
      const { stream_id, user_id } = data;

      socket.leave(`live_${stream_id}`);
      delete liveSocketUsers[socket.id];

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
  // SEND COMMENT — no change
  // =========================================
  socket.on("send_live_comment", async (data, callback) => {
    try {
      const { stream_id, user_id, message } = data;

      if (!message?.trim()) {
        return callback?.({ success: false, message: "Message required" });
      }

      const [streamRows] = await db.query(
        `SELECT id FROM live_streams WHERE id = ? AND status = 'live' LIMIT 1`,
        [stream_id]
      );

      if (!streamRows.length) {
        return callback?.({ success: false, message: "Stream not active" });
      }

      const [result] = await db.query(
        `INSERT INTO live_comments (stream_id, user_id, message, created_at)
         VALUES (?, ?, ?, NOW())`,
        [stream_id, user_id, message.trim()]
      );

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

      io.to(`live_${stream_id}`).emit("new_live_comment", comment);
      callback?.({ success: true, comment });

    } catch (err) {
      console.log("Live Comment Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // SEND LIKE — no change
  // =========================================
  socket.on("send_live_like", async (data, callback) => {
    try {
      const { stream_id, user_id } = data;

      const [result] = await db.query(
        `INSERT IGNORE INTO live_likes (stream_id, user_id, created_at)
         VALUES (?, ?, NOW())`,
        [stream_id, user_id]
      );

      if (result.affectedRows === 0) {
        return callback?.({ success: false, message: "Already liked" });
      }

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
  // SEND GIFT — no change
  // =========================================
  socket.on("send_live_gift", async (data, callback) => {
    try {
      const { stream_id, user_id, astrologer_id, amount, message } = data;

      if (!amount || Number(amount) <= 0) {
        return callback?.({ success: false, message: "Invalid amount" });
      }

      const giftAmount = Number(amount);

      const [streamRows] = await db.query(
        `SELECT id FROM live_streams WHERE id = ? AND status = 'live' LIMIT 1`,
        [stream_id]
      );

      if (!streamRows.length) {
        return callback?.({ success: false, message: "Stream not active" });
      }

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

      // const [walletUpdate] = await db.query(
      //   `UPDATE wallet SET balance = balance - ?
      //    WHERE user_id = ? AND balance >= ?`,
      //   [giftAmount, user_id, giftAmount]
      // );

      // if (walletUpdate.affectedRows === 0) {
      //   return callback?.({ success: false, message: "Wallet deduction failed" });
      // }
const settlement = await settleConsultationCharge({
  user_id,
  astrologer_id,
  amount: giftAmount,
  sessionType: "live",
  sessionId: stream_id,
  reason: "Live Gift"
});

if (!settlement.success) {
  return callback?.({
    success: false,
    message: settlement.reason
  });
}
      // const [txnResult] = await db.query(
      //   `INSERT INTO wallet_transactions
      //    (user_id, type, amount, reason, created_at)
      //    VALUES (?, 'debit', ?, ?, NOW())`,
      //   [user_id, giftAmount, `Live gift to astrologer ${astrologer_id}`]
      // );

//       const [[astro]] = await db.query(
//   `SELECT name FROM astrologers WHERE id = ?`,
//   [astrologer_id]
// );

// const astrologerName = astro?.name || `#${astrologer_id}`;

// const [txnResult] = await db.query(
//   `INSERT INTO wallet_transactions
//    (user_id, type, amount, reason, created_at)
//    VALUES (?, 'debit', ?, ?, NOW())`,
//   [
//     user_id,
//     giftAmount,
//     `Live gift to ${astrologerName}`
//   ]
// );

      // const [giftResult] = await db.query(
      //   `INSERT INTO live_gifts
      //    (stream_id, user_id, astrologer_id, amount, message, wallet_txn_id, created_at)
      //    VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      //   [stream_id, user_id, astrologer_id, giftAmount, message || null, txnResult.insertId]
      // );
const [giftResult] = await db.query(
  `INSERT INTO live_gifts
   (stream_id, user_id, astrologer_id, amount, message, wallet_txn_id, created_at)
   VALUES (?, ?, ?, ?, ?, NULL, NOW())`,
  [
    stream_id,
    user_id,
    astrologer_id,
    giftAmount,
    message || null
  ]
);
      // Astrologer wallet credit
// await db.query(
//   `UPDATE astrologers
//    SET
//      wallet_balance = wallet_balance + ?,
//      total_earnings = total_earnings + ?
//    WHERE id = ?`,
//   [giftAmount, giftAmount, astrologer_id]
// );
      // ===============================
// ORDER CREATE FOR LIVE SESSION
// ===============================
await db.query(
  `INSERT INTO orders
   (order_id, conversation_id, user_id, astrologer_id, astrologer_name,
    consultation_type, price, image, status, start_time, created_at)
   VALUES (?, ?, ?, ?, ?, 'live', ?, ?, 'completed', NOW(), NOW())`,
  [
    `LIVE_${giftResult.insertId}_${Date.now()}`, // order_id unique
    stream_id || null, // live me conversation_id null rahega (ya stream_id bhi rakh sakte ho)
    user_id,
    astrologer_id,
    null, // astrologer_name (agar chaho to fetch karke daal sakte ho)
    giftAmount,
    null // image optional
  ]
);

      const [userRows] = await db.query(
        `SELECT name, profile_image FROM users WHERE id = ? LIMIT 1`,
        [user_id]
      );

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
  // ✅ New: agora_token wala kuch nahi — Agora
  // frontend se band hoga. Hum sirf DB update
  // aur socket notify karte hain.
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
          await db.query(
  `UPDATE orders
   SET end_time = NOW()
   WHERE astrologer_id = ?
     AND consultation_type = 'live'
     AND end_time IS NULL`,
  [astrologer_id]
);
      await db.query(
        `UPDATE live_viewers SET is_active = 0, left_at = NOW()
         WHERE stream_id = ? AND is_active = 1`,
        [stream_id]
      );

      const [stats] = await db.query(
        `SELECT
           viewer_count, total_likes,
           (SELECT COUNT(*) FROM live_comments WHERE stream_id = ? AND is_deleted = 0) AS total_comments,
           (SELECT COALESCE(SUM(amount),0) FROM live_gifts WHERE stream_id = ?) AS total_gifts
         FROM live_streams WHERE id = ?`,
        [stream_id, stream_id, stream_id]
      );

      delete liveSocketUsers[socket.id];

      io.to(`live_${stream_id}`).emit("live_ended", {
        stream_id,
        astrologer_id,
        stats: stats[0],
        message: "Stream has ended"
      });

      console.log(`[LIVE ENDED] stream_id: ${stream_id}`);

      callback?.({ success: true, stats: stats[0] });

    } catch (err) {
      console.log("End Live Error:", err.message);
      callback?.({ success: false, message: err.message });
    }
  });

  // =========================================
  // GET LIVE STATS — no change
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
  // ✅ DISCONNECT HANDLER — ab complete hai
  // =========================================
  const handleLiveDisconnect = async () => {
    try {
      const liveUser = liveSocketUsers[socket.id];

      if (!liveUser) return;

      const { user_id, stream_id, role } = liveUser;

      if (role === "astrologer") {
        // Astrologer disconnect — stream end karo
        await db.query(
          `UPDATE live_streams
           SET status = 'ended', ended_at = NOW()
           WHERE id = ? AND status = 'live'`,
          [stream_id]
        );

        await db.query(
          `UPDATE live_viewers SET is_active = 0, left_at = NOW()
           WHERE stream_id = ? AND is_active = 1`,
          [stream_id]
        );

        io.to(`live_${stream_id}`).emit("live_ended", {
          stream_id,
          message: "Astrologer disconnected — stream ended"
        });

        console.log(`[DISCONNECT] Astrologer ${user_id} -> Stream ${stream_id} ENDED`);

      } else {
        // User disconnect — viewer count update
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

        console.log(`[DISCONNECT] User ${user_id} left Stream ${stream_id}`);
      }

      delete liveSocketUsers[socket.id];

    } catch (err) {
      console.log("Live Disconnect Error:", err.message);
    }
  };

  return { handleLiveDisconnect };
};
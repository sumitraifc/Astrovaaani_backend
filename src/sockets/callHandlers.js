const db = require("../config/db");
const callService = require("../modules/call/service");
const { setAstrologerOnlineStatus } = require("./astrologerHandler");
const { sendNotification } = require("../config/notification");
const { settleConsultationCharge } = require("../utils/settlement");

async function getFcmTokenByType(type, id) {
  const table = type === "astrologer" ? "astrologers" : "users";
  const [rows] = await db.query(
    `SELECT fcm_token FROM ${table} WHERE id = ? LIMIT 1`,
    [Number(id)]
  );
  return rows[0]?.fcm_token || null;
}

async function notifyPush({ targetType, targetId, title, body, data = {} }) {
  const token = await getFcmTokenByType(targetType, targetId);
  if (!token) {
    console.log(`[CALL FCM] No token for ${targetType} ${targetId}`);
    return null;
  }

  try {
    const result = await sendNotification({ token, title, body, data });
    console.log(`[CALL FCM] Sent push to ${targetType} ${targetId}: ${title}`);
    return result;
  } catch (err) {
    console.log(`[CALL FCM] Push failed for ${targetType} ${targetId}:`, err.message);
    return null;
  }
}

/**
 * connectedUsers — socket mapping
 * Format: { userId: socketId, astrologerId: socketId }
 * NOTE: Production mein Redis use karo (multi-instance ke liye)
 *
 * is_online states:
 *   0 = offline
 *   1 = online (available)
 *   2 = busy   (in call / ringing)
 */
const connectedUsers = {};

/**
 * activeCallTimeouts — ringing timeout tracking
 * Format: { call_id: timeoutRef }
 */
const activeCallTimeouts = {};

// ─────────────────────────────────────────────────────────────
// DB HELPERS
// ─────────────────────────────────────────────────────────────

async function updateCallStatus(callId, status, disconnect_reason = null) {
  await db.query(
    `UPDATE call_history
     SET status = ?, disconnect_reason = ?
     WHERE id = ?`,
    [status, disconnect_reason, Number(callId)]
  );
}

async function getWalletBalance(userId) {
  const [rows] = await db.query(
    `SELECT balance FROM wallet WHERE user_id = ? LIMIT 1`,
    [Number(userId)],
  );
  return Number(rows[0]?.balance || 0);
}

async function getAstrologerById(astrologerId) {
  const [rows] = await db.query(
    `SELECT
  id,
  name,
  is_online,
  audio_charge,
  video_charge,
  profile_image,
  expertise,
  commission_percent
FROM astrologers
WHERE id = ?
LIMIT 1`,
    [Number(astrologerId)],
  );
  return rows[0] || null;
}

async function updateCallHistoryStatus(callId, status) {
  await db.query(`UPDATE call_history SET status = ? WHERE id = ?`, [
    status,
    Number(callId),
  ]);
}

async function updateCallHistoryStatuss(
  callId,
  status,
  disconnect_reason
) {
  await db.query(
    `UPDATE call_history
     SET status = ?, disconnect_reason = ?
     WHERE id = ?`,
    [
      status,
      disconnect_reason,
      Number(callId),
    ]
  );
}




/**
 * User ka koi active call already chal raha hai check karo
 * (duplicate call guard)
 */
async function getUserActiveCall(userId) {
  const [rows] = await db.query(
    `SELECT id FROM call_history
     WHERE user_id = ?
     AND status IN ('ringing', 'answered', 'initiate', 'connecting')
     LIMIT 1`,
    [Number(userId)],
  );
  return rows[0] || null;
}

/**
 * Wallet se amount deduct karo
 * Double deduction se bachne ke liye balance check bhi hai
 */
async function deductWalletBalance(userId, amount) {
  const [result] = await db.query(
    `UPDATE wallet
     SET balance = balance - ?
     WHERE user_id = ? AND balance >= ?`,
    [Number(amount), Number(userId), Number(amount)],
  );
  return result.affectedRows > 0; // false = insufficient balance at deduction time
}

async function getUserById(userId) {
  const [rows] = await db.query(
    `SELECT
      id,
      name,
      profile_image
    FROM users
    WHERE id = ?
    LIMIT 1`,
    [Number(userId)],
  );
  return rows[0] || null;
}

// ─────────────────────────────────────────────────────────────
// MAIN SOCKET HANDLER
// ─────────────────────────────────────────────────────────────

module.exports = (io, socket) => {
  // ─────────────────────────────────────────
  // REGISTER
  // User aur Astrologer dono register karte hain
  // ─────────────────────────────────────────
  socket.on("register", async (data) => {
    try {
      const { user_id, role } = data;
      console.log("REGISTER EVENT =>", data);

      connectedUsers[user_id] = socket.id;

      // Sirf astrologer ka is_online DB mein update hoga
      // User ka is_online koi concept nahi — sirf socket track hoga
      if (role === "astrologer") {
        await setAstrologerOnlineStatus(io, user_id, 1); // online
      }
    } catch (err) {
      console.error("REGISTER ERROR =>", err);
    }
  });

  // ─────────────────────────────────────────
  // CALL INITIATE
  // User → Server → Astrologer
  // ─────────────────────────────────────────
  socket.on("call-initiate", async (data) => {
    try {
      console.log("CALL INITIATE EVENT =>", data);

      const { user_id, astrologer_id, call_type } = data;

      // ── 1. Required fields ──
      if (!user_id || !astrologer_id || !call_type) {
        return socket.emit("call-failed", {
          success: false,
          message: "Missing required fields",
        });
      }

      // ── 2. Duplicate call guard ──
      const existingCall = await getUserActiveCall(user_id);
      if (existingCall) {
        return socket.emit("call-failed", {
          success: false,
          message: "You already have an active call in progress",
        });
      }

      // ── 3. Astrologer fetch ──
      const astrologer = await getAstrologerById(astrologer_id);
      const perMinuteCharge =
  call_type === "video"
    ? Number(astrologer.video_charge || 0)
    : Number(astrologer.audio_charge || 0);

const commissionPercent = Number(astrologer.commission_percent || 0);
      if (!astrologer) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer not found",
        });
      }

      const user = await getUserById(user_id);
      if (!user) {
        return socket.emit("call-failed", {
          success: false,
          message: "User not found",
        });
      }

      // ── 4. is_online state check ──
      // Number() cast — MySQL se kabhi string aata hai kabhi int
      const onlineStatus = Number(astrologer.is_online);

      if (onlineStatus === 0) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is offline",
        });
      }

      if (onlineStatus === 2) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is busy in another call",
        });
      }

      // onlineStatus === 1 → proceed

      // ── 5. Wallet balance check ──
      const callCharge =
        call_type === "video"
          ? Number(astrologer.video_charge || 0)
          : Number(astrologer.audio_charge || 0);

      const walletBalance = await getWalletBalance(user_id);

      if (walletBalance < callCharge) {
        return socket.emit("call-failed", {
          success: false,
          message: `Insufficient wallet balance. Minimum required is ₹${callCharge}`,
        });
      }

      // ── 6. Socket online check ──
      const astrologerSocketId = connectedUsers[astrologer_id];
      console.log("ASTROLOGER SOCKET ID =>", astrologerSocketId);

      if (!astrologerSocketId) {
        // Socket nahi mila — DB mein bhi offline kar do (sync fix)
        await setAstrologerOnlineStatus(io, astrologer_id, 0);
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is offline",
        });
      }

      // ── 7. Agora token generate ──
      const tokenData = await callService.generateAgoraToken({
        user_id,
        agent_id: astrologer_id,
        call_type,
        per_minute_charge: perMinuteCharge,
  admin_commission_percent: commissionPercent,
      });

      // ── 8. DB mein initiate status ──
      await updateCallHistoryStatus(tokenData.call_id, "initiate");

        // ── 8.5. Order create karo ──
const orderId = "CALL" + Date.now();
console.log(`[CALL-INITIATE] Creating order:`, {
  orderId,
  call_id: tokenData.call_id,
  user_id,
  astrologer_id,
  call_type
});

const [orderResult] = await db.query(
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
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
  `,
  [
    orderId,
    String(tokenData.call_id),   // call_id ko conversation_id ki jagah use karo
    user_id,
    astrologer_id,
    astrologer.name,
    call_type,                   // "audio" ya "video"
    0,
    "pending"
  ]
);

console.log(`[CALL-INITIATE] Order created:`, {
  order_id: orderId,
  insertId: orderResult.insertId,
  affectedRows: orderResult.affectedRows
});
      // ── 9. Astrologer busy mark karo (is_online = 2) ──
      await setAstrologerOnlineStatus(io, astrologer_id, 2);

      // ── 10. Astrologer ko incoming call emit ──
      io.to(astrologerSocketId).emit("call-initiated", {
        success: true,
        message: "Incoming call",
        data: {
          call_type,
          channel_name: tokenData.channel_name,
          appId: tokenData.appId,
          token: tokenData.astrologer_token,
          uid: tokenData.astrologer_uid,
          // uid: tokenData.uid,
          call_id: tokenData.call_id,

          user_details: {
            id: user.id,
            name: user.name,
            // profile_image: user.profile_image,
            profile_image: user.profile_image
  ? `${process.env.BASE_URL}/uploads/${user.profile_image}`
  : null,
          },

          astrologer_details: {
            id: astrologer.id,
            name: astrologer.name,
          },

          user_id,
          astrologer_id,
        },
      });

      await notifyPush({
        targetType: "astrologer",
        targetId: astrologer_id,
        title: "Incoming call",
        body: `${user.name} is calling you (${call_type})`,
        data: {
          type: "call_initiated",
          call_id: tokenData.call_id,
          call_type,
          user_id,
          astrologer_id,
        },
      });

      // ── 11. DB mein ringing status ──
      await updateCallHistoryStatus(tokenData.call_id, "ringing");

      // ── 12. User ko confirm ──
      socket.emit("call-requested", {
        success: true,
        message: "Call request sentt",
        data: {
          ...tokenData,
          astrologer_id,
          call_type,
         
      name: astrologer.name,
      profile_image: astrologer.profile_image
        ? `${process.env.BASE_URL}/uploads/${astrologer.profile_image}`
        : null,
      expertise: astrologer.expertise,
      is_online: astrologer.is_online,
      audio_charge: astrologer.audio_charge,
      video_charge: astrologer.video_charge,
        },
     
      });
  
//       socket.emit("call-requested", {
//   success: true,
//   message: "Call request sent",
//   data: {
//     // Agora / call token details
//     appId: tokenData.appId,
//     channel_name: tokenData.channel_name,
//     token: tokenData.token,
//     uid: tokenData.uid,
//     call_id: tokenData.call_id,

//     user_id,
//     astrologer_id,

//     // 👇 FULL ASTROLOGER DETAILS (UI ke liye)
//     astrologer_details: {
//       id: astrologer.id,
//       name: astrologer.name,
//       profile_image: astrologer.profile_image
//         ? `${process.env.BASE_URL}/uploads/${astrologer.profile_image}`
//         : null,
//       expertise: astrologer.expertise,
//       is_online: astrologer.is_online,
//       audio_charge: astrologer.audio_charge,
//       video_charge: astrologer.video_charge,
//     },
//   },
// });

      // ── 13. 45 second auto-timeout ──
      // Agar astrologer ne accept/decline nahi kiya
      const timeoutRef = setTimeout(async () => {
        try {
          const [rows] = await db.query(
            `SELECT status FROM call_history WHERE id = ? LIMIT 1`,
            [Number(tokenData.call_id)],
          );

          if (rows[0]?.status === "ringing") {
            // DB: unanswered (45s mein koi response nahi aaya)
            // await updateCallHistoryStatus(tokenData.call_id, "unanswered");
            await updateCallStatus(
  tokenData.call_id,
  "unanswered",
  "timeout"
);
await db.query(
  `
  UPDATE orders
  SET
    status = 'cancelled',
    end_time = NOW()
  WHERE conversation_id = ?
  `,
  [String(tokenData.call_id)]
);
            // Astrologer wapas online (is_online = 1)
            await setAstrologerOnlineStatus(io, astrologer_id, 1);

            // User ko timeout notify
            const userSocketId = connectedUsers[user_id];
            if (userSocketId) {
              io.to(userSocketId).emit("call-timeout", {
                success: true,
                message: "Astrologer did not respond. Please try again.",
                data: { call_id: tokenData.call_id },
              });
            } else {
              await notifyPush({
                targetType: "user",
                targetId: user_id,
                title: "Call timed out",
                body: "Astrologer did not respond. Please try again.",
                data: {
                  type: "call_timeout",
                  call_id: tokenData.call_id,
                },
              });
            }

            // Astrologer ko cancel notify
            if (astrologerSocketId) {
              io.to(astrologerSocketId).emit("call-cancelled", {
                success: true,
                message: "Call timed out — no response",
                data: { call_id: tokenData.call_id },
              });
            }
          }

          delete activeCallTimeouts[tokenData.call_id];
        } catch (err) {
          console.error("CALL TIMEOUT ERROR =>", err);
        }
      }, 45000);

      activeCallTimeouts[tokenData.call_id] = timeoutRef;
    } catch (error) {
      console.error("CALL INITIATE ERROR =>", error);
      socket.emit("call-failed", {
        success: false,
        message: error.message || "Unable to initiate call",
      });
    }
  });




  // ─────────────────────────────────────────
  // CALL ACCEPTED
  // Astrologer → Server → User
  // ─────────────────────────────────────────
  socket.on("call-accepted", async (data) => {
    try {
      const { call_id, user_id, astrologer_id, call_type } = data;

      // Timeout clear — astrologer ne respond kar diya
      if (activeCallTimeouts[call_id]) {
        clearTimeout(activeCallTimeouts[call_id]);
        delete activeCallTimeouts[call_id];
      }

      // DB: connecting (astrologer ne accept kiya, Agora join ho raha hai)
      await updateCallHistoryStatus(call_id, "connecting");

      // User ko notify
      const userSocketId = connectedUsers[user_id];
      if (userSocketId) {
        io.to(userSocketId).emit("call-accepted", {
          success: true,
          message: "Call accepted",
          data,
        });
      }


      // DB: answered (dono connected)
      await updateCallHistoryStatus(call_id, "answered");

      // Astrologer busy rakho (is_online = 2)
      await setAstrologerOnlineStatus(io, astrologer_id, 2);

      // ── Wallet deduction — call start pe ──
      const astrologer = await getAstrologerById(astrologer_id);
      if (astrologer) {
        const callCharge =
          call_type === "video"
            ? Number(astrologer.video_charge || 0)
            : Number(astrologer.audio_charge || 0);

        if (callCharge > 0) {
          console.log(`[CALL-ACCEPT] Rates from DB: audio=${astrologer.audio_charge}, video=${astrologer.video_charge}`);
          console.log(`[CALL-ACCEPT] Deducting charge: ${callCharge} from user ${user_id}`);
          
          const settlement = await settleConsultationCharge({
            user_id,
            astrologer_id,
            amount: callCharge,
            sessionType: "call",
            sessionId: call_id,
            reason: `${call_type} call`
          });

          console.log(`[CALL-ACCEPT] Settlement result:`, settlement);

          if (userSocketId) {
            io.to(userSocketId).emit("wallet-deducted", {
              success: settlement.success,
              message: settlement.success
                ? `₹${callCharge} deducted for ${call_type} call`
                : "Wallet deduction failed — insufficient balance",
              data: { amount: callCharge, call_id },
            });
          }

          if (!settlement.success) {
            console.log(`[CALL-ACCEPT] ❌ Settlement failed: ${settlement.reason}`);
            await updateCallStatus(call_id, "hangup", "insufficient_balance");
            await db.query(
              `
              UPDATE orders
              SET
                status = 'cancelled',
                end_time = NOW()
              WHERE conversation_id = ?
              `,
              [String(call_id)]
            );
            await setAstrologerOnlineStatus(io, astrologer_id, 1);

            const astrologerSocketId = connectedUsers[astrologer_id];
            if (astrologerSocketId) {
              io.to(astrologerSocketId).emit("call-ended", {
                success: true,
                message: "User wallet insufficient. Call ended.",
                data: { call_id },
              });
            }
            return;
          }
        }

        await db.query(
          `UPDATE astrologers
           SET total_sessions = COALESCE(total_sessions,0) + 1,
               ${call_type === "video" ? "total_video" : "total_audio"} = COALESCE(${call_type === "video" ? "total_video" : "total_audio"},0) + 1
           WHERE id = ?`,
          [astrologer_id]
        );
      }
    } catch (error) {
      console.error("CALL ACCEPT ERROR =>", error);
    }
  });

  // ─────────────────────────────────────────
  // CALL DECLINED
  // Astrologer → Server → User
  // ─────────────────────────────────────────
  socket.on("call-declined", async (data, callback) => {
  try {
    const { call_id, user_id, astrologer_id } = data;

    // Timeout clear
    if (activeCallTimeouts[call_id]) {
      clearTimeout(activeCallTimeouts[call_id]);
      delete activeCallTimeouts[call_id];
    }

    // DB update
    // await updateCallHistoryStatus(call_id, "decline");
    await updateCallStatus(
  call_id,
  "decline",
  "astrologer_declined"
);
await db.query(
  `
  UPDATE orders
  SET
    status = 'cancelled',
    end_time = NOW()
  WHERE conversation_id = ?
  `,
  [String(call_id)]
);

    // User notify
    const userSocketId = connectedUsers[user_id];
    if (userSocketId) {
      io.to(userSocketId).emit("call-declined", {
        success: true,
        message: "Astrologer declined the call",
        call_id,
      });
    } else {
      await notifyPush({
        targetType: "user",
        targetId: user_id,
        title: "Call declined",
        body: "Astrologer declined the call.",
        data: {
          type: "call_declined",
          call_id,
          astrologer_id,
        },
      });
    }

    // Astrologer online again
    await setAstrologerOnlineStatus(io, astrologer_id, 1);

    // ACK to astrologer
    if (callback) {
      callback({
        success: true,
        message: "Call declined successfully",
        call_id,
      });
    }

  } catch (error) {
    console.error("CALL DECLINE ERROR =>", error);

    if (callback) {
      callback({
        success: false,
        message: error.message || "Failed to decline call",
      });
    }
  }
});


  // ─────────────────────────────────────────
  // CALL ENDED
  // User ya astrologer — koi bhi end kar sakta hai
  // ─────────────────────────────────────────
  socket.on("call-ended", async (data) => {
     console.log("CALL ENDED DATA =>", data);
    try {
      const { call_id, user_id, astrologer_id ,ended_by} = data;
        const endTime = Math.floor(Date.now() / 1000);
      // Timeout clear
      if (activeCallTimeouts[call_id]) {
        clearTimeout(activeCallTimeouts[call_id]);
        delete activeCallTimeouts[call_id];
      }

      // DONO sides ko emit karo (jo bhi end kare, doosre ko bhi jaaye)
      const userSocketId = connectedUsers[user_id];
      const astrologerSocketId = connectedUsers[astrologer_id];

      if (userSocketId && userSocketId !== socket.id) {
        io.to(userSocketId).emit("call-ended", {
          success: true,
          message: "Call ended",
          data,
        });
      } else if (user_id && Number(user_id) !== Number(astrologer_id)) {
        await notifyPush({
          targetType: "user",
          targetId: user_id,
          title: "Call ended",
          body: "Call ended.",
          data: {
            type: "call_ended",
            call_id,
            ended_by,
          },
        });
      }

      if (astrologerSocketId && astrologerSocketId !== socket.id) {
        io.to(astrologerSocketId).emit("call-ended", {
          success: true,
          message: "Call ended",
          data,
        });
      } else if (astrologer_id) {
        await notifyPush({
          targetType: "astrologer",
          targetId: astrologer_id,
          title: "Call ended",
          body: "Call ended.",
          data: {
            type: "call_ended",
            call_id,
            ended_by,
          },
        });
      }
  console.log("CONNECTED USERS =>", connectedUsers);
  console.log("USER SOCKET =>", userSocketId);
  console.log("ASTRO SOCKET =>", astrologerSocketId);
  console.log("CURRENT SOCKET =>", socket.id);
      // DB: hangup
      // await updateCallHistoryStatuss(call_id, "hangup");
      const [rows] = await db.query(
  `SELECT start_time, call_type FROM call_history WHERE id = ?`,
  [call_id]
);

const startTime = rows[0]?.start_time || 0;
const callType = rows[0]?.call_type || "audio";
const duration = endTime - startTime;
const minutes = Math.ceil(duration / 60);

      await updateCallHistoryStatuss(
  call_id,
  "hangup",
  ended_by === "astrologer"
    ? "astrologer_ended"
    : "user_ended"
);
// Compute final price and update order
const [perRows] = await db.query(`SELECT per_minute_charge FROM call_history WHERE id = ? LIMIT 1`, [call_id]);
const perMinute = Number(perRows[0]?.per_minute_charge || 0);
const totalPrice = Number((perMinute * minutes).toFixed(2));
await db.query(
  `
  UPDATE orders
  SET
    price = ?,
    status = 'completed',
    end_time = NOW()
  WHERE conversation_id = ?
  `,
  [totalPrice, String(call_id)]
);
console.log(`[CALL-END] Order ${call_id} updated: minutes=${minutes}, per_min=${perMinute}, total=${totalPrice}`);

await db.query(
  `UPDATE call_history 
   SET end_time = ?, duration = ?
   WHERE id = ?`,
  [endTime, duration, call_id]
);

if (minutes > 0) {
  await db.query(
    `UPDATE astrologers
     SET ${callType === "video" ? "total_video_minutes" : "total_audio_minutes"} = COALESCE(${callType === "video" ? "total_video_minutes" : "total_audio_minutes"},0) + ?
     WHERE id = ?`,
    [minutes, astrologer_id]
  );
}
      // Astrologer wapas online (is_online = 1)
      if (astrologer_id) {
        await setAstrologerOnlineStatus(io, astrologer_id, 1);
      }
    } catch (error) {
      console.error("CALL END ERROR =>", error);
    }
  });

  // ─────────────────────────────────────────
  // CALL CANCELLED
  // User ne ringing ke dauran cancel kiya
  // ─────────────────────────────────────────
  socket.on("call-cancelled", async (data) => {
    try {
      const { call_id, user_id, astrologer_id } = data;

      // Timeout clear
      if (activeCallTimeouts[call_id]) {
        clearTimeout(activeCallTimeouts[call_id]);
        delete activeCallTimeouts[call_id];
      }

      // Astrologer ko cancel notify
      const astrologerSocketId = connectedUsers[astrologer_id];
      if (astrologerSocketId) {
        io.to(astrologerSocketId).emit("call-cancelled", {
          success: true,
          message: "User cancelled the call",
          data,
        });
      } else {
        await notifyPush({
          targetType: "astrologer",
          targetId: astrologer_id,
          title: "Call cancelled",
          body: "User cancelled the call.",
          data: {
            type: "call_cancelled",
            call_id,
          },
        });
      }

      // DB: unanswered (user ne khud cancel kiya)
      // await updateCallHistoryStatus(call_id, "unanswered");
await updateCallStatus(
  call_id,
  "unanswered",
  "user_cancelled"
);
await db.query(
  `
  UPDATE orders
  SET
    status = 'cancelled',
    end_time = NOW()
  WHERE conversation_id = ?
  `,
  [String(call_id)]
);
      // Astrologer wapas online (is_online = 1)
      await setAstrologerOnlineStatus(io, astrologer_id, 1);
    } catch (error) {
      console.error("CALL CANCEL ERROR =>", error);
    }
  });

  // ─────────────────────────────────────────
  // DISCONNECT HANDLER
  // Socket drop hone par full cleanup
  // ─────────────────────────────────────────
  const handleCallDisconnect = async () => {
    try {
      for (const userId in connectedUsers) {
        if (connectedUsers[userId] === socket.id) {
          delete connectedUsers[userId];

          // Astrologer offline mark karo (is_online = 0)
          await setAstrologerOnlineStatus(io, Number(userId), 0);

          // Agar ye user/astrologer active call mein tha
          const [activeCalls] = await db.query(
            `SELECT id, user_id, agent_id
             FROM call_history
             WHERE (user_id = ? OR agent_id = ?)
             AND status IN ('initiate', 'connecting', 'ringing', 'answered')
             LIMIT 1`,
            [Number(userId), Number(userId)],
          );

          if (activeCalls.length > 0) {
            const call = activeCalls[0];

            // DB: disconnect
            await updateCallHistoryStatus(call.id, "disconnect");
            // Compute final price and update order based on per_minute_charge * minutes (if available)
            try {
              const [callRow] = await db.query(`SELECT per_minute_charge, start_time, end_time, duration FROM call_history WHERE id = ? LIMIT 1`, [call.id]);
              const perMinute = Number(callRow[0]?.per_minute_charge || 0);
              let totalPrice = 0;
              if (callRow[0]) {
                const dur = Number(callRow[0].duration || 0);
                const mins = Math.ceil((dur || 0) / 60);
                totalPrice = Number((perMinute * mins).toFixed(2));
              }
              await db.query(
                `
                UPDATE orders
                SET
                  price = ?,
                  status = 'completed',
                  end_time = NOW()
                WHERE conversation_id = ?
                `,
                [totalPrice, String(call.id)]
              );
              console.log(`[CALL-DISCONNECT] Order ${call.id} updated: price=${totalPrice}`);
            } catch (e) {
              console.log(`[CALL-DISCONNECT] Failed to update order price for ${call.id}:`, e.message);
            }
            // Doosri party ko notify karo
            const otherUserId =
              Number(userId) === Number(call.user_id)
                ? call.agent_id
                : call.user_id;

            const otherSocketId = connectedUsers[otherUserId];
            const otherType = Number(userId) === Number(call.user_id) ? "astrologer" : "user";
            if (otherSocketId) {
              io.to(otherSocketId).emit("call-ended", {
                success: true,
                message: "Other party disconnected",
                data: { call_id: call.id },
              });
            } else {
              await notifyPush({
                targetType: otherType,
                targetId: otherUserId,
                title: "Call disconnected",
                body: "Other party disconnected from the call.",
                data: {
                  type: "call_disconnected",
                  call_id: call.id,
                },
              });
            }
            if (call.agent_id) {
              await setAstrologerOnlineStatus(io, call.agent_id, 1);
            }

            // Active timeout clear karo
            if (activeCallTimeouts[call.id]) {
              clearTimeout(activeCallTimeouts[call.id]);
              delete activeCallTimeouts[call.id];
            }
          }

          break; // userId mil gaya, loop band karo
        }
      }
    } catch (err) {
      console.error("DISCONNECT CLEANUP ERROR =>", err);
    }
  };

  return { handleCallDisconnect, connectedUsers };
};

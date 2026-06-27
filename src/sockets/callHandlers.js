const db = require("../config/db");
const callService = require("../modules/call/service");
const { setAstrologerOnlineStatus } = require("./astrologerHandler");
const { sendNotification } = require("../config/notification");
const { settleConsultationCharge } = require("../utils/settlement");

async function getFcmTokenByType(type, id) {
  console.log("[DEBUG] getFcmTokenByType", { type, id });
  const table = type === "astrologer" ? "astrologers" : "users";
  const [rows] = await db.query(
    `SELECT fcm_token FROM ${table} WHERE id = ? LIMIT 1`,
    [Number(id)]
  );
  return rows[0]?.fcm_token || null;
}

async function notifyPush({ targetType, targetId, title, body, data = {}, type = "notification" }) {
  console.log("[DEBUG] notifyPush", { targetType, targetId, title, body, data, type });
  const token = await getFcmTokenByType(targetType, targetId);
  if (!token) {
    console.log(`[CALL FCM] No token for ${targetType} ${targetId}`);
    return null;
  }

  try {
    const result = await sendNotification({ token, title, body, data, type });
    console.log(`[CALL FCM] Sent push to ${targetType} ${targetId}: ${title}`);
    return result;
  } catch (err) {
    console.log(`[CALL FCM] Push failed for ${targetType} ${targetId}:`, err.message);
    return null;
  }
}

/**
 * connectedUsers — socket mapping
 * Format: socket.io rooms: user:<id>, astrologer:<id>
 * NOTE: Production mein Redis use karo (multi-instance ke liye)
 *
 * is_online states:
 *   0 = offline
 *   1 = online (available)
 *   2 = busy   (in call / ringing)
 */

function getUserRoom(userId) {
  const room = `user:${userId}`;
  console.log("[DEBUG] getUserRoom", { userId, room });
  return room;
}

function getAstrologerRoom(astrologerId) {
  const room = `astrologer:${astrologerId}`;
  console.log("[DEBUG] getAstrologerRoom", { astrologerId, room });
  return room;
}

function isRoomActive(io, room) {
  const active = !!io.sockets.adapter.rooms.get(room);
  console.log("[DEBUG] isRoomActive", { room, active });
  return active;
}

/**
 * activeCallTimeouts — ringing timeout tracking
 * Format: { call_id: timeoutRef }
 */
const activeCallTimeouts = {};

/**
 * activeCallBillingTimers — recurring call charge timers
 * Format: { call_id: intervalRef }
 */
const activeCallBillingTimers = {};

function clearCallBillingTimer(callId) {
  console.log("[DEBUG] clearCallBillingTimer", { callId });
  if (activeCallBillingTimers[callId]) {
    clearInterval(activeCallBillingTimers[callId]);
    delete activeCallBillingTimers[callId];
  }
}

// ─────────────────────────────────────────────────────────────
// DB HELPERS
// ─────────────────────────────────────────────────────────────

async function updateCallStatus(callId, status, disconnect_reason = null) {
  console.log("[DEBUG] updateCallStatus", { callId, status, disconnect_reason });
  await db.query(
    `UPDATE call_history
     SET status = ?, disconnect_reason = ?
     WHERE id = ?`,
    [status, disconnect_reason, Number(callId)]
  );
}

async function getWalletBalance(userId) {
  console.log("[DEBUG] getWalletBalance", { userId });
  const [rows] = await db.query(
    `SELECT balance FROM wallet WHERE user_id = ? LIMIT 1`,
    [Number(userId)],
  );
  return Number(rows[0]?.balance || 0);
}

async function getAstrologerById(astrologerId) {
  console.log("[DEBUG] getAstrologerById", { astrologerId });
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
  console.log("[DEBUG] updateCallHistoryStatus", { callId, status });
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
  console.log("[DEBUG] updateCallHistoryStatuss", { callId, status, disconnect_reason });
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
  console.log("[DEBUG] getUserActiveCall", { userId });
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
  console.log("[DEBUG] deductWalletBalance", { userId, amount });
  const [result] = await db.query(
    `UPDATE wallet
     SET balance = balance - ?
     WHERE user_id = ? AND balance >= ?`,
    [Number(amount), Number(userId), Number(amount)],
  );
  return result.affectedRows > 0; // false = insufficient balance at deduction time
}

async function getUserById(userId) {
  console.log("[DEBUG] getUserById", { userId });
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
      console.log("[DEBUG] socket.register", data);
      const { user_id, role } = data;
      console.log("REGISTER EVENT =>", data);

      const normalizedRole = role === "astrologer" ? "astrologer" : "user";
      const room = normalizedRole === "astrologer"
        ? getAstrologerRoom(user_id)
        : getUserRoom(user_id);

      if (socket.data.currentRoom && socket.data.currentRoom !== room) {
        socket.leave(socket.data.currentRoom);
      }

      socket.join(room);
      socket.data.currentRoom = room;
      socket.data.role = normalizedRole;
      socket.data.user_id = Number(user_id);

      // NOTE: Astrologer status is NOT updated here
      // Status (online/offline/busy) is managed manually via admin/API, not socket lifecycle
      console.log(`[REGISTER] ${normalizedRole} ${user_id} connected to room ${room}`);
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
      console.log("[DEBUG] socket.call-initiate", data);

      // const { user_id, astrologer_id, call_type } = data;

      const { user_id, astrologer_id, call_type, member_id  } = data;

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

      let consultationPerson;

if (member_id) {
  const [memberRows] = await db.query(
    `SELECT id, name, relation, gender, dob, birth_time, birth_place
     FROM user_family_members
     WHERE id = ? AND user_id = ? LIMIT 1`,
    [member_id, user_id]
  );
  consultationPerson = memberRows[0]
    ? { type: "member", ...memberRows[0] }
    : { type: "self", id: user.id, name: user.name };
} else {
  const [userDetail] = await db.query(
    `SELECT id, name, gender, dob, birth_time, birth_place
     FROM users WHERE id = ? LIMIT 1`,
    [user_id]
  );
  consultationPerson = {
    type: "self",
    ...userDetail[0]
  };
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

      // ── 6. Check astrologer DB status (not socket connection) ──
      const astrologerRoom = getAstrologerRoom(astrologer_id);
      const dbOnlineStatus = Number(astrologer.is_online);
      console.log("[CALL-INITIATE] Astrologer DB status check:", { astrologer_id, is_online: dbOnlineStatus, room: astrologerRoom });

      // Status already checked above (lines ~330-340), but verify again
      if (dbOnlineStatus === 0) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is offline",
        });
      }

      if (dbOnlineStatus === 2) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is busy in another call",
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
      io.to(astrologerRoom).emit("call-initiated", {
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

            consultation_person: consultationPerson,
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
        title: `Incoming ${call_type.toUpperCase()} Call`,
        body: `Call from ${user.name}`,
        type: "data",
        data: {
          channel_name: String(tokenData.channel_name),
          token:String(tokenData.astrologer_token),
          start_time: String(Date.now()),
          call_type: String(call_type),
          video_call_status: "pending",
          call_long_duration: "0",
          caller_id: String(user.id),
          caller_name: String(user.name || ""),
          caller_image: user.profile_image
            ? `${process.env.BASE_URL}/uploads/${user.profile_image}`
            : "",
          receiver_id: String(astrologer.id),
          receiver_name: String(astrologer.name || ""),
          receiver_image: astrologer.profile_image
            ? `${process.env.BASE_URL}/uploads/${astrologer.profile_image}`
            : "",
          call_id: String(tokenData.call_id),
          status: "connecting",
          type: "call_initiated",
        }
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
            const userRoom = getUserRoom(user_id);
            if (isRoomActive(io, userRoom)) {
              io.to(userRoom).emit("call-timeout", {
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
            if (isRoomActive(io, astrologerRoom)) {
              io.to(astrologerRoom).emit("call-cancelled", {
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
      console.log("[DEBUG] socket.call-accepted", data);
      const { call_id, user_id, astrologer_id, call_type } = data;

      // Timeout clear — astrologer ne respond kar diya
      if (activeCallTimeouts[call_id]) {
        clearTimeout(activeCallTimeouts[call_id]);
        delete activeCallTimeouts[call_id];
      }

      // DB: connecting (astrologer ne accept kiya, Agora join ho raha hai)
      await updateCallHistoryStatus(call_id, "connecting");

      // User ko notify
      const userRoom = getUserRoom(user_id);
      if (isRoomActive(io, userRoom)) {
        io.to(userRoom).emit("call-accepted", {
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
        const [callRows] = await db.query(
          `SELECT call_type, per_minute_charge FROM call_history WHERE id = ? LIMIT 1`,
          [call_id]
        );
        const savedCallType = callRows[0]?.call_type || null;
        const savedPerMinute = Number(callRows[0]?.per_minute_charge || 0);
        const actualCallType = call_type || savedCallType || "audio";
        const callCharge =
          savedPerMinute > 0
            ? savedPerMinute
            : actualCallType === "video"
            ? Number(astrologer.video_charge || 0)
            : Number(astrologer.audio_charge || 0);

        console.log(`[CALL-ACCEPT] Rates from DB: audio=${astrologer.audio_charge}, video=${astrologer.video_charge}`);
        console.log(`[CALL-ACCEPT] call_type resolved to ${actualCallType}, per_minute_charge from history=${savedPerMinute}, using charge=${callCharge}`);
        console.log(`[CALL-ACCEPT] Deducting charge: ${callCharge} from user ${user_id}`);
        
        if (callCharge > 0) {
          const settlement = await settleConsultationCharge({
            user_id,
            astrologer_id,
            amount: callCharge,
            sessionType: "call",
            sessionId: call_id,
            reason: `${actualCallType} call`
          });

          console.log(`[CALL-ACCEPT] Settlement result:`, settlement);

          if (settlement.success) {
            await db.query(
              `UPDATE call_history
               SET amount = amount + ?, per_minute_charge = ?
               WHERE id = ?`,
              [callCharge, callCharge, call_id]
            );
          }

          const userRoom = getUserRoom(user_id);
          if (isRoomActive(io, userRoom)) {
            io.to(userRoom).emit("wallet-deducted", {
              success: settlement.success,
              message: settlement.success
                ? `₹${callCharge} deducted for ${actualCallType} call`
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

            const astrologerRoom = getAstrologerRoom(astrologer_id);
            if (isRoomActive(io, astrologerRoom)) {
              io.to(astrologerRoom).emit("call-ended", {
                success: true,
                message: "User wallet insufficient. Call ended.",
                data: { call_id },
              });
            }
            return;
          }

          if (!activeCallBillingTimers[call_id]) {
            activeCallBillingTimers[call_id] = setInterval(async () => {
              try {
                const [historyRows] = await db.query(
                  `SELECT status, call_type, per_minute_charge, start_time FROM call_history WHERE id = ? LIMIT 1`,
                  [call_id]
                );

                if (!historyRows[0] || historyRows[0].status !== "answered") {
                  clearCallBillingTimer(call_id);
                  return;
                }

                const recurringCallType = historyRows[0]?.call_type || actualCallType;
                let recurringCharge = Number(historyRows[0]?.per_minute_charge || 0);
                if (recurringCharge <= 0) {
                  recurringCharge = recurringCallType === "video"
                    ? Number(astrologer.video_charge || 0)
                    : Number(astrologer.audio_charge || 0);
                }

                const walletBalance = await getWalletBalance(user_id);
                if (walletBalance < recurringCharge) {
                  console.log(`[CALL-BILLING] Low balance detected for call ${call_id}: balance=${walletBalance}, required=${recurringCharge}`);
                  clearCallBillingTimer(call_id);

                  const endTime = Math.floor(Date.now() / 1000);
                  const [existingCall] = await db.query(
                    `SELECT start_time FROM call_history WHERE id = ? LIMIT 1`,
                    [call_id]
                  );
                  const startTime = Number(existingCall[0]?.start_time || endTime);
                  const duration = endTime - startTime;
                  const minutes = Math.ceil(duration / 60);
                  const totalPrice = Number((recurringCharge * minutes).toFixed(2));

                  await updateCallHistoryStatuss(call_id, "hangup", "insufficient_balance");
                  await db.query(
                    `UPDATE call_history SET end_time = ?, duration = ? WHERE id = ?`,
                    [endTime, duration, call_id]
                  );
                  await db.query(
                    `UPDATE orders SET price = ?, status = 'completed', end_time = NOW() WHERE conversation_id = ?`,
                    [totalPrice, String(call_id)]
                  );
                  await setAstrologerOnlineStatus(io, astrologer_id, 1);

                  const userRoom = getUserRoom(user_id);
                  const astrologerRoom = getAstrologerRoom(astrologer_id);
                  if (isRoomActive(io, userRoom)) {
                    io.to(userRoom).emit("call-ended", {
                      success: false,
                      message: "Call ended because wallet balance is insufficient.",
                      data: { call_id, reason: "insufficient_balance" },
                    });
                  }
                  if (isRoomActive(io, astrologerRoom)) {
                    io.to(astrologerRoom).emit("call-ended", {
                      success: true,
                      message: "Call ended because user wallet balance is insufficient.",
                      data: { call_id, reason: "insufficient_balance" },
                    });
                  }
                  return;
                }

                const recurringSettlement = await settleConsultationCharge({
                  user_id,
                  astrologer_id,
                  amount: recurringCharge,
                  sessionType: "call",
                  sessionId: call_id,
                  reason: `${recurringCallType} call`
                });

                console.log(`[CALL-BILLING] Recurring settlement for call ${call_id}:`, recurringSettlement);

                if (recurringSettlement.success) {
                  await db.query(
                    `UPDATE call_history SET amount = amount + ? WHERE id = ?`,
                    [recurringCharge, call_id]
                  );
                }

                if (!recurringSettlement.success) {
                  console.log(`[CALL-BILLING] Recurring settlement failed for call ${call_id}`);
                  clearCallBillingTimer(call_id);

                  const endTime = Math.floor(Date.now() / 1000);
                  const [existingCall] = await db.query(
                    `SELECT start_time FROM call_history WHERE id = ? LIMIT 1`,
                    [call_id]
                  );
                  const startTime = Number(existingCall[0]?.start_time || endTime);
                  const duration = endTime - startTime;
                  const minutes = Math.ceil(duration / 60);
                  const totalPrice = Number((recurringCharge * minutes).toFixed(2));

                  await updateCallHistoryStatuss(call_id, "hangup", "insufficient_balance");
                  await db.query(
                    `UPDATE call_history SET end_time = ?, duration = ? WHERE id = ?`,
                    [endTime, duration, call_id]
                  );
                  await db.query(
                    `UPDATE orders SET price = ?, status = 'completed', end_time = NOW() WHERE conversation_id = ?`,
                    [totalPrice, String(call_id)]
                  );
                  await setAstrologerOnlineStatus(io, astrologer_id, 1);

                  const userRoom = getUserRoom(user_id);
                  const astrologerRoom = getAstrologerRoom(astrologer_id);
                  if (isRoomActive(io, userRoom)) {
                    io.to(userRoom).emit("call-ended", {
                      success: false,
                      message: "Call ended because wallet charge could not be processed.",
                      data: { call_id, reason: "billing_failed" },
                    });
                  }
                  if (isRoomActive(io, astrologerRoom)) {
                    io.to(astrologerRoom).emit("call-ended", {
                      success: true,
                      message: "Call ended because user wallet charge could not be processed.",
                      data: { call_id, reason: "billing_failed" },
                    });
                  }
                }
              } catch (timerError) {
                console.error(`[CALL-BILLING] Error for call ${call_id}:`, timerError);
              }
            }, 60000);
          }
        }

        await db.query(
          `UPDATE astrologers
           SET total_sessions = COALESCE(total_sessions,0) + 1,
               ${actualCallType === "video" ? "total_video" : "total_audio"} = COALESCE(${actualCallType === "video" ? "total_video" : "total_audio"},0) + 1
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
    console.log("[DEBUG] socket.call-declined", data);
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
    const userRoom = getUserRoom(user_id);
    if (isRoomActive(io, userRoom)) {
      io.to(userRoom).emit("call-declined", {
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
     console.log("[DEBUG] socket.call-ended", data);
    try {
      const { call_id, user_id, astrologer_id ,ended_by} = data;
        const endTime = Math.floor(Date.now() / 1000);
      // Timeout clear
      if (activeCallTimeouts[call_id]) {
        clearTimeout(activeCallTimeouts[call_id]);
        delete activeCallTimeouts[call_id];
      }
      clearCallBillingTimer(call_id);

      // DONO sides ko emit karo (jo bhi end kare, doosre ko bhi jaaye)
      const userRoom = getUserRoom(user_id);
      const astrologerRoom = getAstrologerRoom(astrologer_id);

      socket.to(userRoom).emit("call-ended", {
        success: true,
        message: "Call ended",
        data,
      });

      if (!isRoomActive(io, userRoom) && user_id && Number(user_id) !== Number(astrologer_id)) {
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

      socket.to(astrologerRoom).emit("call-ended", {
        success: true,
        message: "Call ended",
        data,
      });

      if (!isRoomActive(io, astrologerRoom) && astrologer_id) {
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
      // DB: hangup
      const [rows] = await db.query(
  `SELECT status, start_time, call_type, per_minute_charge FROM call_history WHERE id = ? LIMIT 1`,
  [call_id]
);

const callStatus = rows[0]?.status || "hangup";
const startTime = rows[0]?.start_time || 0;
const callType = rows[0]?.call_type || "audio";
let perMinute = Number(rows[0]?.per_minute_charge || 0);

// For unanswered/declined calls: duration = 0, no charge
let duration = 0;
let minutes = 0;
if (callStatus === "answered") {
  duration = endTime - startTime;
  minutes = Math.ceil(duration / 60);
} else if (callStatus === "unanswered" || callStatus === "decline") {
  // Call never started → no charge
  duration = 0;
  minutes = 0;
}

      await updateCallHistoryStatuss(
  call_id,
  "hangup",
  ended_by === "astrologer"
    ? "astrologer_ended"
    : "user_ended"
);

      const astrologer = await getAstrologerById(astrologer_id);
      if (perMinute <= 0 && astrologer) {
        perMinute = callType === "video"
          ? Number(astrologer.video_charge || 0)
          : Number(astrologer.audio_charge || 0);
      }

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
      console.log(`[CALL-END] Order ${call_id} updated: minutes=${minutes}, callType=${callType}, per_min=${perMinute}, total=${totalPrice}`);

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
      console.log("[DEBUG] socket.call-cancelled", data);
      const { call_id, user_id, astrologer_id } = data;

      // Timeout clear
      if (activeCallTimeouts[call_id]) {
        clearTimeout(activeCallTimeouts[call_id]);
        delete activeCallTimeouts[call_id];
      }

      // Astrologer ko cancel notify
      const astrologerRoom = getAstrologerRoom(astrologer_id);
      if (isRoomActive(io, astrologerRoom)) {
        io.to(astrologerRoom).emit("call-cancelled", {
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
      console.log("[DEBUG] handleCallDisconnect", { socketId: socket.id, role: socket.data?.role, user_id: socket.data?.user_id });
      const role = socket.data?.role;
      const disconnectedId = socket.data?.user_id;
      if (!role || !disconnectedId) {
        return;
      }

      const numericId = Number(disconnectedId);

      // Agar ye user/astrologer active call mein tha
          const [activeCalls] = await db.query(
            `SELECT id, user_id, agent_id
             FROM call_history
             WHERE (user_id = ? OR agent_id = ?)
             AND status IN ('initiate', 'connecting', 'ringing', 'answered')
             LIMIT 1`,
            [numericId, numericId],
          );

      if (activeCalls.length > 0) {
        const call = activeCalls[0];

        // DB: disconnect
        clearCallBillingTimer(call.id);
        await updateCallHistoryStatus(call.id, "disconnect");
        // Compute final price and update order based on per_minute_charge * minutes (if available)
        try {
              const [callRow] = await db.query(`SELECT call_type, per_minute_charge, start_time, duration FROM call_history WHERE id = ? LIMIT 1`, [call.id]);
              const callType = callRow[0]?.call_type || "audio";
              let perMinute = Number(callRow[0]?.per_minute_charge || 0);
              const startTime = Number(callRow[0]?.start_time || 0);
              const recordedDuration = Number(callRow[0]?.duration || 0);
              const now = Math.floor(Date.now() / 1000);
              const dur = recordedDuration > 0 ? recordedDuration : Math.max(0, now - startTime);
              const mins = Math.ceil(dur / 60);
              if (perMinute <= 0) {
                const astro = await getAstrologerById(call.agent_id);
                perMinute = callType === "video"
                  ? Number(astro?.video_charge || 0)
                  : Number(astro?.audio_charge || 0);
              }
              const totalPrice = Number((perMinute * mins).toFixed(2));
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
              console.log(`[CALL-DISCONNECT] Order ${call.id} updated: minutes=${mins}, callType=${callType}, per_min=${perMinute}, total=${totalPrice}`);
            } catch (e) {
              console.log(`[CALL-DISCONNECT] Failed to update order price for ${call.id}:`, e.message);
            }
            // Doosri party ko notify karo
            const otherUserId =
              role === "user"
                ? call.agent_id
                : call.user_id;

            const otherType = role === "user" ? "astrologer" : "user";
            const otherRoom = otherType === "user"
              ? getUserRoom(otherUserId)
              : getAstrologerRoom(otherUserId);
            if (isRoomActive(io, otherRoom)) {
              io.to(otherRoom).emit("call-ended", {
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
    } catch (err) {
      console.error("DISCONNECT CLEANUP ERROR =>", err);
    }
  };

  return { handleCallDisconnect };
};

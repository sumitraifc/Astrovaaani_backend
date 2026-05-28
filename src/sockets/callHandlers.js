const db = require("../config/db");
const callService = require("../modules/call/service");
const connectedUsers = {};
const { setAstrologerOnlineStatus, setAstrologerChatStatus } = require("./astrologerHandler");

async function getWalletBalance(userId) {
  const [rows] = await db.query(
    `SELECT balance FROM wallet WHERE user_id = ? LIMIT 1`,
    [Number(userId)]
  );
  return Number(rows[0]?.balance || 0);
}

async function getAstrologerById(astrologerId) {
  const [rows] = await db.query(
    `
      SELECT
        id,
        name,
        chat_status,
        is_online,
        audio_charge,
        video_charge
      FROM astrologers
      WHERE id = ?
      LIMIT 1
    `,
    [Number(astrologerId)]
  );
  return rows[0] || null;
}

async function updateCallHistoryStatus(callId, status) {
  await db.query(
    `UPDATE call_history SET status = ? WHERE id = ?`,
    [status, Number(callId)]
  );
}

module.exports = (io, socket) => {
  /**
   * =========================================
   * REGISTER USER / ASTROLOGER
   * =========================================
   */
  socket.on("register", async (userId) => {
    connectedUsers[userId] = socket.id;
    console.log("USER REGISTERED =>", userId, socket.id);
    await setAstrologerOnlineStatus(io, userId, 1);
  });

  /**
   * =========================================
   * CALL INITIATE
   * =========================================
   */
  socket.on("call-initiate", async (data) => {
    try {
      console.log("CALL INITIATE EVENT =>", data);

      const { user_id, astrologer_id, call_type, user_details, astrologer_details } = data;

      if (!user_id || !astrologer_id || !call_type) {
        return socket.emit("call-failed", {
          success: false,
          message: "Missing required fields"
        });
      }

      const astrologer = await getAstrologerById(astrologer_id);
      if (!astrologer) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer not found"
        });
      }

      if (!astrologer.chat_status) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer status not available"
        });
      }

      if (astrologer.chat_status === "busy") {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is busy"
        });
      }

      const callCharge = call_type === "video" ? Number(astrologer.video_charge || 0) : Number(astrologer.audio_charge || 0);
      const walletBalance = await getWalletBalance(user_id);

      if (walletBalance < callCharge) {
        return socket.emit("call-failed", {
          success: false,
          message: `Insufficient wallet balance. Minimum required is ₹${callCharge}`
        });
      }

      const astrologerSocketId = connectedUsers[astrologer_id];
      if (!astrologerSocketId) {
        return socket.emit("call-failed", {
          success: false,
          message: "Astrologer is offline"
        });
      }

      const tokenData = await callService.generateAgoraToken({
        user_id,
        agent_id: astrologer_id,
        call_type
      });

      await setAstrologerChatStatus(io, astrologer_id, "busy");
      await setAstrologerOnlineStatus(io, astrologer_id, 1);

      io.to(astrologerSocketId).emit("call-initiated", {
        success: true,
        message: "Incoming call",
        data: {
          call_type,
          channel_name: tokenData.channel_name,
          appId: tokenData.appId,
          token: tokenData.token,
          uid: tokenData.uid,
          call_id: tokenData.call_id,
          user_details,
          astrologer_details,
          user_id,
          astrologer_id
        }
      });

      await updateCallHistoryStatus(tokenData.call_id, "ringing");

      socket.emit("call-requested", {
        success: true,
        message: "Call request sent",
        data: {
          ...tokenData,
          astrologer_id,
          call_type
        }
      });
    } catch (error) {
      console.log("CALL SOCKET ERROR =>", error);
      socket.emit("call-failed", {
        success: false,
        message: error.message || "Unable to initiate call"
      });
    }
  });

  socket.on("call-accepted", async (data) => {
    try {
      const { call_id, user_id, astrologer_id, channel_name, call_type } = data;

      const userSocketId = connectedUsers[user_id];
      if (userSocketId) {
        io.to(userSocketId).emit("call-accepted", {
          success: true,
          message: "Call accepted",
          data
        });
      }

      await updateCallHistoryStatus(call_id, "answered");
      await setAstrologerChatStatus(io, astrologer_id, "busy");
    } catch (error) {
      console.log("CALL ACCEPT ERROR =>", error);
    }
  });

  socket.on("call-declined", async (data) => {
    try {
      const { call_id, user_id, astrologer_id } = data;
      const userSocketId = connectedUsers[user_id];

      if (userSocketId) {
        io.to(userSocketId).emit("call-declined", {
          success: false,
          message: "Astrologer declined the call",
          data
        });
      }

      await updateCallHistoryStatus(call_id, "decline");
      await setAstrologerChatStatus(io, astrologer_id, "online");
    } catch (error) {
      console.log("CALL DECLINE ERROR =>", error);
    }
  });

  socket.on("call-ended", async (data) => {
    try {
      const { call_id, user_id, astrologer_id } = data;
      const otherSocketId = connectedUsers[user_id] || connectedUsers[astrologer_id];

      if (otherSocketId && otherSocketId !== socket.id) {
        io.to(otherSocketId).emit("call-ended", {
          success: true,
          message: "Call ended",
          data
        });
      }

      if (astrologer_id) {
        await setAstrologerChatStatus(io, astrologer_id, "online");
      }

      await updateCallHistoryStatus(call_id, "hangup");
    } catch (error) {
      console.log("CALL END ERROR =>", error);
    }
  });

  /**
   * =========================================
   * DISCONNECT HANDLER FOR CALLS
   * =========================================
   */
  const handleCallDisconnect = async () => {
    for (const userId in connectedUsers) {
      if (connectedUsers[userId] === socket.id) {
        delete connectedUsers[userId];
        await setAstrologerOnlineStatus(io, Number(userId), 0);
      }
    }
  };

  return { handleCallDisconnect, connectedUsers };
};

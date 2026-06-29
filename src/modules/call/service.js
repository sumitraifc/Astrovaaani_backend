const {
  RtcTokenBuilder,
  RtcRole,
} = require("agora-access-token");

const {
  APP_ID,
  APP_CERTIFICATE,
} = require("../../config/agora");

const repository = require("./repository");
const db = require("../../config/db");

exports.generateAgoraToken = async (body) => {
  try {
    console.log("\n========================================");
    console.log("🚀 GENERATE AGORA TOKEN SERVICE HIT");
    console.log("========================================");

    if (!APP_ID || !APP_CERTIFICATE) {
      console.error("❌ Agora credentials missing");
      throw new Error(
        "Agora credentials (APP_ID or APP_CERTIFICATE) not configured"
      );
    }

    console.log("📥 REQUEST BODY =>", body);

    const {
      user_id,
      agent_id,
      call_type,
    } = body;

    console.log("👤 USER ID =>", user_id);
    console.log("🔮 AGENT ID =>", agent_id);
    console.log("📞 CALL TYPE =>", call_type);

    // UNIQUE CHANNEL
    const channel_name = `call_${user_id}_${agent_id}_${Date.now()}`;

    console.log("🏠 CHANNEL NAME =>", channel_name);

    // Separate UID for User & Astrologer
    const userUid = Number(user_id);
    const astrologerUid = Number(agent_id);

    console.log("👤 USER UID =>", userUid);
    console.log("🔮 ASTROLOGER UID =>", astrologerUid);

    const role = RtcRole.PUBLISHER;

    console.log("🎭 ROLE =>", role);

    const expireTime = 3600; // 1 hour

    console.log("⏰ EXPIRE TIME =>", expireTime);

    const currentTime = Math.floor(Date.now() / 1000);

    console.log("🕒 CURRENT TIME =>", currentTime);

    const privilegeExpiredTs =
      currentTime + expireTime;

    console.log(
      "⌛ PRIVILEGE EXPIRE TS =>",
      privilegeExpiredTs
    );

    console.log("🔑 GENERATING USER TOKEN...");

    const userToken =
      RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channel_name,
        userUid,
        role,
        privilegeExpiredTs
      );

    console.log("✅ USER TOKEN GENERATED");

    console.log("🔑 GENERATING ASTROLOGER TOKEN...");

    const astrologerToken =
      RtcTokenBuilder.buildTokenWithUid(
        APP_ID,
        APP_CERTIFICATE,
        channel_name,
        astrologerUid,
        role,
        privilegeExpiredTs
      );

    console.log("✅ ASTROLOGER TOKEN GENERATED");

    console.log("💾 SAVING CALL HISTORY...");

    const result =
      await repository.createCallHistory({
        user_id,
        agent_id,
        channel_name,
        call_type,
        status: "initiate",
        start_time: currentTime,
      });

    console.log("✅ CALL HISTORY SAVED");
    console.log("📄 DB RESULT =>", result);
    console.log("🆔 CALL ID =>", result.insertId);

    console.log("========================================");
    console.log("🎉 TOKEN GENERATION COMPLETED");
    console.log("========================================\n");

    return {
      appId: APP_ID,

      call_id: result.insertId,

      channel_name,

      // USER
      user_uid: userUid,
      user_token: userToken,

      // ASTROLOGER
      astrologer_uid: astrologerUid,
      astrologer_token: astrologerToken,
    };
  } catch (error) {
    console.error("\n❌ AGORA TOKEN GENERATION ERROR");
    console.error(error);
    console.error("========================================\n");

    throw error;
  }
};

// exports.manualDecline = async (req, res) => {
  

//     try {

//         const io = req.app.get("io");

//         const { channel_name } = req.body;

//         if (!channel_name) {
//             return res.status(400).json({
//                 success: false,
//                 message: "channel_name is required"
//             });
//         }

//         const callData =
//             await repository.getCallByChannel(
//                 channel_name
//             );

//         if (!callData) {
//             return res.status(404).json({
//                 success: false,
//                 message: "Call not found"
//             });
//         }

//         // await db.query(
//         //     `UPDATE call_history
//         //      SET
//         //         status='declined',
//         //         end_time=NOW(),
//         //         updated_at=NOW()
//         //      WHERE channel_name=?`,
//         //     [channel_name]
//         // );
// await db.query(
//     `UPDATE call_history
//      SET
//         status='decline',
//         disconnect_reason='Astrologer declined the call',
//         end_time=NOW()
        
//      WHERE channel_name=?`,
//     [channel_name]
// );
//         const payload = {
//             success: true,
//             message: "Call declined",
//             data: {
//                 call_id: callData.id,
//                 channel_name: callData.channel_name,
//                 caller_id: callData.user_id,
//                 agent_id: callData.agent_id,
//                 call_type: callData.call_type,
//                 status: "decline",
//                 disconnect_reason: "Astrologer disconnected the call"
//             }
//         };
// console.log("IO =>", io);
// console.log("Call Data =>", callData);
//         io.to(String(callData.user_id))
//             .emit(
//                 "call:status_update",
//                 payload
//             );

//         io.to(String(callData.agent_id))
//             .emit(
//                 "call:status_update",
//                 payload
//             );

//         return res.json({
//             success: true,
//             message: "Call declined successfully",
//             data: payload.data
//         });

//     } catch (error) {

//         console.log(error);

//         return res.status(500).json({
//             success: false,
//             message: error.message
//         });

//     }

// };


exports.manualDecline = async (req, res) => {
    try {

        const io = req.app.get("io");
        const { channel_name } = req.body;

        if (!channel_name) {
            return res.status(400).json({
                success: false,
                message: "channel_name is required"
            });
        }

        // 1. Get call data
        const callData = await repository.getCallByChannel(channel_name);

        if (!callData) {
            return res.status(404).json({
                success: false,
                message: "Call not found"
            });
        }

        // 2. Clear timeout safely
        if (activeCallTimeouts?.[callData.id]) {
            clearTimeout(activeCallTimeouts[callData.id]);
            delete activeCallTimeouts[callData.id];
        }

        // 3. Update call history
        await db.query(
            `UPDATE call_history
             SET
                status = 'decline',
                disconnect_reason = 'Astrologer declined the call',
                end_time = UNIX_TIMESTAMP()
             WHERE channel_name = ?`,
            [channel_name]
        );

        // 4. Free astrologer / agent
        await callModel.updateOnlineStatus(callData.agent_id, 1);

        // 5. Payload
        const payload = {
            success: true,
            message: "Call declined",
            data: {
                call_id: callData.id,
                channel_name: callData.channel_name,
                caller_id: callData.user_id,
                agent_id: callData.agent_id,
                call_type: callData.call_type,
                status: "decline",
                disconnect_reason: "Astrologer declined the call"
            }
        };

        console.log("Call Declined =>", callData.id);

        // 6. Emit to user
        io.to(String(callData.user_id)).emit(
            "call:status_update",
            payload
        );

        // 7. Emit to agent
        io.to(String(callData.agent_id)).emit(
            "call:status_update",
            payload
        );

        // 8. Response
        return res.json({
            success: true,
            message: "Call declined successfully",
            data: payload.data
        });

    } catch (error) {

        console.log("manualDecline Error =>", error);

        return res.status(500).json({
            success: false,
            message: error.message || "Server error"
        });
    }
};
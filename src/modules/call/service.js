const {
  RtcTokenBuilder,
  RtcRole,
} = require("agora-access-token");

const {
  APP_ID,
  APP_CERTIFICATE,
} = require("../../config/agora");

const repository = require("./repository");

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
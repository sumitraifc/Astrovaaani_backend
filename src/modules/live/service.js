const {
  RtcTokenBuilder,
  RtcRole,
} = require("agora-access-token");

const {
  APP_ID,
  APP_CERTIFICATE,
} = require("../../config/agora");

const repository = require("./repository");

/**
 * Astrologer ke liye — BROADCASTER token
 * Ye tab call hoga jab astrologer "Go Live" kare
 */
exports.generateLiveToken = async (body) => {
  try {
    console.log("\n========================================");
    console.log("🚀 GENERATE LIVE TOKEN SERVICE HIT");
    console.log("========================================");

    if (!APP_ID || !APP_CERTIFICATE) {
      throw new Error("Agora credentials missing");
    }

    const { astrologer_id, title } = body;

    console.log("🔮 ASTROLOGER ID =>", astrologer_id);
    console.log("📝 TITLE =>", title);

    // Already live check
    const existing = await repository.getActiveLiveByAstrologer(astrologer_id);
    if (existing) {
      throw new Error("Already live");
    }

    // Unique channel/stream_key
    const stream_key = `live_${astrologer_id}_${Date.now()}`;
    console.log("🏠 STREAM KEY =>", stream_key);

    const astrologerUid = Number(astrologer_id);
    const expireTime = 7200; // 2 hours (live long ho sakti hai)
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expireTime;

    console.log("🔑 GENERATING BROADCASTER TOKEN...");

    // BROADCASTER token — publish kar sakta hai
    const broadcasterToken = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      stream_key,
      astrologerUid,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    );

    console.log("✅ BROADCASTER TOKEN GENERATED");

    // DB mein stream record banao
    console.log("💾 SAVING LIVE STREAM...");
    const result = await repository.createLiveStream({
      astrologer_id,
      title: title || "Live Session",
      stream_key
    });

    console.log("✅ LIVE STREAM SAVED");
    console.log("🆔 STREAM ID =>", result.insertId);

    console.log("========================================");
    console.log("🎉 LIVE TOKEN GENERATION COMPLETED");
    console.log("========================================\n");

    return {
      appId: APP_ID,
      stream_id: result.insertId,
      stream_key,
      channel_name: stream_key,       // Agora mein channel = stream_key

      // Astrologer broadcaster
      astrologer_uid: astrologerUid,
      astrologer_token: broadcasterToken,

      role: "broadcaster",
      expire_at: privilegeExpiredTs
    };

  } catch (error) {
    console.error("❌ LIVE TOKEN ERROR =>", error);
    throw error;
  }
};

/**
 * User ke liye — AUDIENCE (viewer) token
 * Ye tab call hoga jab user live join kare
 */
exports.generateViewerToken = async (body) => {
  try {
    console.log("\n========================================");
    console.log("🚀 GENERATE VIEWER TOKEN SERVICE HIT");
    console.log("========================================");

    if (!APP_ID || !APP_CERTIFICATE) {
      throw new Error("Agora credentials missing");
    }

    const { user_id, stream_id } = body;

    console.log("👤 USER ID =>", user_id);
    console.log("📺 STREAM ID =>", stream_id);

    // Stream fetch
    const stream = await repository.getStreamById(stream_id);

    if (!stream) {
      throw new Error("Stream not found");
    }

    if (stream.status !== "live") {
      throw new Error("Stream has ended");
    }

    const userUid = Number(user_id);
    const expireTime = 7200;
    const privilegeExpiredTs = Math.floor(Date.now() / 1000) + expireTime;

    console.log("🔑 GENERATING AUDIENCE TOKEN...");

    // AUDIENCE token — sirf dekh sakta hai, publish nahi
    const audienceToken = RtcTokenBuilder.buildTokenWithUid(
      APP_ID,
      APP_CERTIFICATE,
      stream.stream_key,
      userUid,
      RtcRole.SUBSCRIBER,            // ← audience
      privilegeExpiredTs
    );

    console.log("✅ AUDIENCE TOKEN GENERATED");
    console.log("========================================\n");

    return {
      appId: APP_ID,
      stream_id: stream.id,
      stream_key: stream.stream_key,
      channel_name: stream.stream_key,

      // User audience
      user_uid: userUid,
      user_token: audienceToken,

      role: "audience",
      expire_at: privilegeExpiredTs
    };

  } catch (error) {
    console.error("❌ VIEWER TOKEN ERROR =>", error);
    throw error;
  }
};
const {
    RtcTokenBuilder,
    RtcRole
} = require('agora-access-token');

const {
    APP_ID,
    APP_CERTIFICATE
} = require('../../config/agora');

const repository = require('./repository');

exports.generateAgoraToken = async (body) => {

    console.log("=========== SERVICE HIT ===========");

    console.log("REQUEST BODY => ", body);

    const {
        user_id,
        agent_id,
        call_type
    } = body;

    console.log("USER ID => ", user_id);

    console.log("AGENT ID => ", agent_id);

    console.log("CALL TYPE => ", call_type);

    // UNIQUE CHANNEL NAME
    const channel_name =
        `room_${user_id}_${Date.now()}`;

    console.log("CHANNEL NAME => ", channel_name);

    const uid = parseInt(user_id);

    console.log("UID => ", uid);

    const role = RtcRole.PUBLISHER;

    console.log("ROLE => ", role);

    const expireTime = 3600;

    console.log("EXPIRE TIME => ", expireTime);

    const currentTime =
        Math.floor(Date.now() / 1000);

    console.log("CURRENT TIME => ", currentTime);

    const privilegeExpiredTs =
        currentTime + expireTime;

    console.log(
        "PRIVILEGE EXPIRE TS => ",
        privilegeExpiredTs
    );

    console.log("GENERATING TOKEN...");

    // GENERATE TOKEN
    const token =
        RtcTokenBuilder.buildTokenWithUid(
            APP_ID,
            APP_CERTIFICATE,
            channel_name,
            uid,
            role,
            privilegeExpiredTs
        );

    console.log("TOKEN GENERATED SUCCESS");

    console.log("TOKEN => ", token);

    console.log("SAVING CALL HISTORY IN DB...");

    // SAVE DB
    const result =
        await repository.createCallHistory({
            user_id,
            agent_id,
            channel_name,
            call_type,
            status: 'initiate',
            start_time: currentTime
        });

    console.log("DB RESULT => ", result);

    console.log("CALL HISTORY SAVED SUCCESS");

    return {
        token,
        appId: APP_ID,
        channel_name,
        uid,
        call_id: result.insertId
    };
};
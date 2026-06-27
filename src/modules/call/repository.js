const db = require('../../config/db');

exports.createCallHistory = async (data) => {

    try {

        console.log("=========== REPOSITORY HIT ===========");

        console.log("DATA => ", data);

       
         const sql = `
    INSERT INTO call_history
    (
        user_id,
        agent_id,
        channel_name,
        call_type,
        status,
        start_time,
        per_minute_charge,
        admin_commission_percent
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;
        console.log("RUNNING QUERY...");

        
        const [result] = await db.query(
    sql,
    [
        data.user_id,
        data.agent_id,
        data.channel_name,
        data.call_type,
        data.status,
        data.start_time,

        // 🔥 NEW FIELDS
        data.per_minute_charge || 0,
        data.admin_commission_percent || 0
    ]
);

        console.log("QUERY SUCCESS");

        console.log("RESULT => ", result);

        return result;

    } catch (error) {

        console.log(
            "REPOSITORY ERROR => ",
            error
        );

        throw error;
    }
};

exports.getCallByChannel = async (channel_name) => {

    const [[call]] = await db.query(
        `
        SELECT *
        FROM call_history
        WHERE channel_name = ?
        LIMIT 1
        `,
        [channel_name]
    );

    return call;
};
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
                start_time
            )
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        console.log("RUNNING QUERY...");

        const [result] = await db.execute(
            sql,
            [
                data.user_id,
                data.agent_id,
                data.channel_name,
                data.call_type,
                data.status,
                data.start_time
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
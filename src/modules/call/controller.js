const service = require('./service');

exports.generateToken = async (req, res) => {

    console.log("============= API HIT =============");

    console.log("REQUEST BODY => ", req.body);

    try {

        const {
            user_id,
            agent_id,
            call_type
        } = req.body;

        console.log("USER ID => ", user_id);

        console.log("AGENT ID => ", agent_id);

        console.log("CALL TYPE => ", call_type);

        // VALIDATION
        if (
            !user_id ||
            !agent_id
        ) {

            console.log("VALIDATION FAILED");

            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        console.log("VALIDATION SUCCESS");

        // SERVICE CALL
        const response =
            await service.generateAgoraToken(
                req.body
            );

        console.log("SERVICE RESPONSE => ", response);

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {

        console.log("CONTROLLER ERROR => ", error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const service = require("./service");

exports.storePanchang = async (req, res) => {

    try {

        const { date } = req.body;

        if (!date) {
            return res.status(400).json({
                status: false,
                message: "date is required"
            });
        }

        const result = await service.storePanchang(date);

        return res.json(result);

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

exports.getAll = async (req, res) => {

    try {

        const data = await service.getAll();

        return res.json({
            status: true,
            data
        });

    } catch (error) {

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
const service = require("./service");

/**
 * STORE PANCHANG
 */
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

        console.error("STORE PANCHANG ERROR =>", error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

/**
 * GET ALL PANCHANG
 */
exports.getAll = async (req, res) => {
    try {

        const data = await service.getAll();

        return res.json({
            status: true,
            data
        });

    } catch (error) {

        console.error("GET ALL PANCHANG ERROR =>", error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};

/**
 * GET PANCHANG BY DATE
 */
exports.getByDate = async (req, res) => {
    try {

        const { date } = req.body;

        if (!date) {
            return res.status(400).json({
                status: false,
                message: "date is required"
            });
        }

        const result = await service.getPanchangByDate(date);

        return res.json(result);

    } catch (error) {

        console.error("GET PANCHANG BY DATE ERROR =>", error);

        return res.status(500).json({
            status: false,
            message: error.message
        });
    }
};
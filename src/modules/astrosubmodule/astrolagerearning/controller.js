const service = require("./service");

exports.getEarningHistory = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getEarningHistory(
      astrologerId,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: "Earning history fetched successfully",
      data: result
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message
    });

  }
};
const service = require("./service");

exports.getHome = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getHome(astrologerId);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};
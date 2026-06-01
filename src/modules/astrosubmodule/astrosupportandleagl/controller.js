const service = require("./service");

exports.getContent = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getContent(astrologerId);

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
const service = require("./service");

exports.getService = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getService(astrologerId);

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

exports.updateService = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.updateService(
      astrologerId,
      req.body
    );

    res.json({
      success: true,
      message: "Service updated successfully",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
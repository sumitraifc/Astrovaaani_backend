const service = require("./service");

exports.getConfig = async (req, res) => {
  try {
    const data = await service.getConfig();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const data = await service.getBanners();

    res.json({
      success: true,
      data
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};
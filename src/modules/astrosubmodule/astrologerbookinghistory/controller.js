const service = require("./service");

exports.getBookingHistory = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getBookingHistory(
      astrologerId,
      req.query
    );

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

exports.getBookingDetail = async (req, res) => {
  try {

    const astrologerId = req.user.id;

    const result = await service.getBookingDetail(
      astrologerId,
      req.params.id,
      req.query.source
    );

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
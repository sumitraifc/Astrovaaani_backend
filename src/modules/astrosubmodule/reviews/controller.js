const service = require("./service");

exports.addReview = async (req, res) => {
  try {

    const userId = req.user.id;

    const result = await service.addReview(userId, req.body);

    res.json({
      success: true,
      message: "Review added successfully",
      data: result
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.getReviews = async (req, res) => {
  try {

    const result = await service.getReviews(
      req.params.astrologerId,
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
const service = require("./service");

// exports.getDetails = async (req, res) => {
//   try {

//     const data = await service.getDetails(
//       req.params.astrologer_id
//     );

//     res.json({
//       success: true,
//       data
//     });

//   } catch (err) {

//     res.status(500).json({
//       success: false,
//       message: err.message
//     });

//   }
// };

exports.getDetails = async (req, res, next) => {
  try {

    const data = await service.getDetails(
      req.user.id
    );

    res.json({
      success: true,
      data
    });

  } catch (err) {
    next(err);
  }
};

exports.updateDetails = async (req, res) => {
  try {

    const result =
      await service.updateDetails(
        req.params.astrologer_id,
        req.body
      );

    res.json(result);

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};
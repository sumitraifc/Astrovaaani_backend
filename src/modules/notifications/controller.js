const service = require("./service");

// exports.getNotifications = async (req, res) => {
//   try {
//     const result = await service.getNotifications(
//       req.user.id
//     );

//     res.json(result);
//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };

exports.getNotifications = async (req, res) => {
  try {

    const { role, user_id, astrologer_id } = req.body;

    const result = await service.getNotifications(
      role === "user" ? user_id : null,
      role === "astrologer" ? astrologer_id : null,
      role
    );

    res.json(result);

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const result = await service.markAsRead(
      req.params.id,
      req.user.id
    );

    res.json(result);
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
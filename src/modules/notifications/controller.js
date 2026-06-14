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

    const { id, role } = req.user;

    const result = await service.getNotifications(
      role === "user" ? id : null,
      role === "astrologer" ? id : null,
      role
    );

    res.json(result);

  } catch (err) {
    res.status(400).json({
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
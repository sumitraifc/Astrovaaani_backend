

const service = require("./service");

exports.sendOtp = async (req, res) => {
  try {
    const result = await service.sendOtp(req.body.mobile);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const result = await service.verifyOtp(
      req.body.mobile,
      req.body.otp
    );
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const result = await service.updateProfile(
      req.user.id,
      req.body,
      req.file
    );

    return res.json({
      success: true,
      message: "Profile updated successfully",
      data: result
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const result = await service.getUser(req.user.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Auth API is running successfully test",
    status: "OK"
  });
};
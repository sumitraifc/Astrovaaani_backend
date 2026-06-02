

const service = require("./service");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// exports.sendOtp = async (req, res) => {
//   try {
//     const result = await service.sendOtp(req.body.mobile);
//     res.json(result);
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// exports.sendOtp = async (req, res) => {
//   try {
//     const { mobile, role } = req.body;

//     const result = await service.sendOtp(mobile, role);

//     res.json(result);

//   } catch (err) {
//     res.status(400).json({
//       success: false,
//       message: err.message
//     });
//   }
// };
exports.sendOtp = async (req, res, next) => {
  try {

    const { mobile, role } = req.body;

    // =========================
    // VALIDATION (400 ERROR)
    // =========================
    if (!mobile) {
      return next({
        status: 400,
        message: "Mobile number is required"
      });
    }

    const result = await service.sendOtp(mobile, role);

    res.json({
      success: true,
      data: result
    });

  } catch (err) {

    // =========================
    // SERVICE FAIL / EXTERNAL ISSUE (503)
    // =========================
    if (err.code === "SERVICE_UNAVAILABLE" || err.isAxiosError) {
      return next({
        status: 503,
        message: "OTP service temporarily unavailable"
      });
    }

    // =========================
    // DEFAULT ERROR (500)
    // =========================
    next(err);
  }
};
exports.verifyOtp = async (req, res) => {

  try {

   const result = await service.verifyOtp(
  req.body.mobile,
  req.body.otp,
  req.body.fcm_token,

);

    /**
     * NEW USER
     */
    if (result.statusCode === 401) {

      return res.status(401).json(result);
    }

    /**
     * LOGIN SUCCESS
     */
    return res.json(result);

  } catch (err) {

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.register = async (req, res) => {
  try {
   const result = await service.register(req.body);

    res.json(result);

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const result = await service.updateProfile(
      req.user.id,
      req.body,
      req.file
    );
    console.log("CWD:", process.cwd());
// console.log("FILE:", req.file);

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


///faimely membe 
exports.addMember = async (req, res) => {
  try {
    const result = await service.addMember(
      req.user?.id || null,
      req.body
    );

    res.json({
      success: true,
      message: "Family member added/updated",
      data: result
    });

  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMembers = async (req, res) => {
  try {
    const result = await service.getMembers(req.user.id);

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.getMemberById = async (req, res) => {
  try {
    const result = await service.getMemberById(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

exports.deleteMember = async (req, res) => {
  try {
    await service.deleteMember(
      req.params.id,
      req.user.id
    );

    res.json({
      success: true,
      message: "Deleted"
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};
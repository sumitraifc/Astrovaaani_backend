// const router = require('express').Router();
// const ctrl = require('./controller');

// router.post('/register',ctrl.register);
// router.post('/login',ctrl.login);
// router.get('/', ctrl.healthCheck); 

// module.exports = router;

const router = require("express").Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth");

// OTP FLOW
router.post("/send-otp", controller.sendOtp);
router.post("/verify-otp", controller.verifyOtp);

// PROFILE
router.patch("/profileupdate", auth, controller.updateProfile);
router.get("/getprofile", auth, controller.getUser);

router.get('/', controller.healthCheck); 
module.exports = router;
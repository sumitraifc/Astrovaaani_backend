const express = require("express");
const router = express.Router();

const controller = require("./controller");
const verifyToken = require("../../../middlewares/auth");

// single API
router.get("/",  controller.getContent);
// router.get("/", verifyToken, controller.getContent);

module.exports = router;
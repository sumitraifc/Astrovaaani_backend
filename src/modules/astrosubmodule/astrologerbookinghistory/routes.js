const express = require("express");
const router = express.Router();

const controller = require("./controller");

const verifyToken = require("../../../middlewares/auth");

// dashboard + history
router.get("/history", verifyToken, controller.getBookingHistory);

// single booking detail
router.get("/history/:id", verifyToken, controller.getBookingDetail);

module.exports = router;
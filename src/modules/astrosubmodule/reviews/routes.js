const express = require("express");
const router = express.Router();

const controller = require("./controller");
const verifyToken = require("../../../middlewares/auth");

// add review
router.post("/", verifyToken, controller.addReview);

// get astrologer reviews
router.get("/",verifyToken ,controller.getReviews);

module.exports = router;
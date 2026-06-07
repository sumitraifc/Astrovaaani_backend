const express = require("express");
const router = express.Router();
const controller = require("./controller");

// List all astrologers (with optional ?approval_status=pending filter)
router.get("/astrologers", controller.getAll);

// Get single astrologer detail
router.get("/astrologers/:id", controller.getDetail);

// Approve or reject a specific step
// Body: { step: 2, status: "rejected", remark: "ID proof is blurry" }
router.post("/astrologers/:id/review-step", controller.reviewStep);

module.exports = router;

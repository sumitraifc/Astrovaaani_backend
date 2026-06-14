const express = require("express");
const controller = require("./controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

// router.get("/", auth, controller.getNotifications);

router.post("/", auth, controller.getNotifications);

router.patch("/:id/read", auth, controller.markAsRead);

module.exports = router;
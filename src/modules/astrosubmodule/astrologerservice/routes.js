const express = require("express");
const router = express.Router();

const controller = require("./controller");
const verifyToken = require("../../../middlewares/auth");

// get service pricing
router.get("/", verifyToken, controller.getService);

// update service pricing
router.put("/", verifyToken, controller.updateService);

module.exports = router;
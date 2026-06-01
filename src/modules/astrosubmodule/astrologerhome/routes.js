const express = require("express");
const router = express.Router();

const controller = require("./controller");
const verifyToken = require("../../../middlewares/auth");

router.get("/", verifyToken, controller.getHome);

module.exports = router;
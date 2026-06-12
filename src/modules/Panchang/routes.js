const express = require("express");
const router = express.Router();

const controller = require("./controller");

router.post("/store", controller.storePanchang);

router.get("/", controller.getAll);

module.exports = router;
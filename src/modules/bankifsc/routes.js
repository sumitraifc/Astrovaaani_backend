const express = require("express");
const router = express.Router();
const Controller = require("./controller");

router.get("/:ifsc", Controller.getBankIfsc);

module.exports = router;
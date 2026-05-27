const express = require("express");
const router = express.Router();

const controller = require("./controller");

/**
 * GET ALL EXPERTISE
 */
router.get("/", controller.getAll);

module.exports = router;
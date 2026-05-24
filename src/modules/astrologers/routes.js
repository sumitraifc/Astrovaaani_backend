const express = require("express");

const controller = require("./controller");

const auth = require("../../middlewares/auth");

const router = express.Router();

/**
 * PUBLIC APIs
 */

router.get("/", controller.getAstrologers);

router.get("/:id", controller.getAstrologerById);

/**
 * ADMIN APIs
 */

router.post("/", auth, controller.createAstrologer);

router.put("/:id", auth, controller.updateAstrologer);

router.patch("/:id/status", auth, controller.changeStatus);

module.exports = router;
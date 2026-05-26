const express = require("express");

const controller = require("./controller");

const auth = require("../../middlewares/auth");
const optionalAuth = require("../../middlewares/optionalAuth");

const router = express.Router();

/**
 * PUBLIC APIs
 */

router.get("/", controller.getAstrologers);

router.get("/:id",optionalAuth,controller.getAstrologerById);

// router.get("/:id", optionalAuth,controller.getAstrologerById);


/**
 * ADMIN APIs
 */

router.post("/", auth, controller.createAstrologer);

router.put("/:id", auth, controller.updateAstrologer);

router.patch("/:id/status", auth, controller.changeStatus);

module.exports = router;
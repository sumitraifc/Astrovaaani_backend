const router = require("express").Router();
const controller = require("./controller");
const auth = require("../../middlewares/auth");

router.get("/stats", auth, controller.getStats);

router.get("/history", auth, controller.getHistory);

module.exports = router;
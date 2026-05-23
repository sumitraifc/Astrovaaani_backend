const router = require("express").Router();
const controller = require("./controller");

// ALL CONTENT IN ONE
router.get("/config", controller.getConfig);

// BANNERS ONLY
router.get("/banner", controller.getBanners);

module.exports = router;
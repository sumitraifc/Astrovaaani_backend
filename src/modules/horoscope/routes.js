const router = require("express").Router();
const controller = require("./controller");

router.get("/zodiacs", controller.getZodiacs);

router.get("/:zodiacId", controller.getHoroscope);

router.get("/detail/:id", controller.getById);

router.post("/", controller.create);

router.put("/:id", controller.update);

module.exports = router;
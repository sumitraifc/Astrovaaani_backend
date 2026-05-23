const router = require("express").Router();

const controller = require("./controller");

router.get("/privacy-policy", controller.getPrivacyPolicy);

router.get("/terms", controller.getTerms);

router.get("/helpandsupport", controller.getContactUs);

router.get("/faqs", controller.getFaqs);

router.get("/banners", controller.getBanners);

module.exports = router;
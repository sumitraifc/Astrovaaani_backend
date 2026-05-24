const express = require("express");
const router = express.Router();

const controller = require("./controller");

const auth = require("../../middlewares/auth");

/**
 * ADD FAVORITE
 */
router.post(
  "/:astrologerId",
  auth,
  controller.addFavorite
);

/**
 * GET FAVORITES
 */
router.get(
  "/",
  auth,
  controller.getFavorites
);

/**
 * REMOVE FAVORITE
 */
router.delete(
  "/:astrologerId",
  auth,
  controller.removeFavorite
);

module.exports = router;
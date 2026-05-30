const express = require("express");
const router = express.Router();

const controller = require("./controller");

const auth = require("../../../middleware/auth");

// Get Bank Details
router.get(
  "/:astrologer_id",
  auth,
  controller.getDetails
);

// Update Bank Details
router.put(
  "/:astrologer_id",
  auth,
  controller.updateDetails
);

module.exports = router;
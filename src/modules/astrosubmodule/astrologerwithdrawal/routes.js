const router = require("express").Router();
const verifyToken = require("../../../middlewares/auth");
const controller = require("./controller");

// Earnings history (token se user id milega)
router.get("/history", verifyToken, controller.getEarningHistory);

// Wallet info
router.get("/wallet", verifyToken, controller.getWalletInfo);

// Withdrawal request
router.post("/", verifyToken, controller.requestWithdraw);

// Withdrawal history
router.get("/withdraw/history", verifyToken, controller.getWithdrawHistory);

module.exports = router;
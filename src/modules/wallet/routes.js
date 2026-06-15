const express = require("express");
const controller = require("./controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.get("/", auth, controller.getWallet);

router.get("/transactions", auth, controller.getTransactions);

router.post("/add", auth, controller.addMoney);

router.post("/payment-order", auth, controller.createPaymentOrder);

router.get("/cashfree-callback", controller.cashfreeCallback);

router.post("/spend", auth, controller.spendMoney);

router.post("/refund", auth, controller.refundMoney);

module.exports = router;
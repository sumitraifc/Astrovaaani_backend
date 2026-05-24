const express = require("express");
const controller = require("./controller");
const auth = require("../../middlewares/auth");

const router = express.Router();

router.post("/", auth, controller.createOrder);

router.get("/", auth, controller.getOrders);

router.get("/:id", auth, controller.getOrderById);

module.exports = router;
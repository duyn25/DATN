const express = require("express");
const router = express.Router();
const { createOrder, momoIpnHandler,getAllOrdersByUser,
    getOrderDetails,cancelOrderById } = require("../../controller/shop/order-controller");

router.post("/create", createOrder);
router.post("/momo-ipn", momoIpnHandler);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.put("/cancel/:id",cancelOrderById);
module.exports = router;

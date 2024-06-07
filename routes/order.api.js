const express =require('express');
const authController = require("../controller/auth.controller");
const orderController = require("../controller/order.controller");
const router = express.Router();

//주문 추가
router.post("/", authController.authenticate, orderController.createOrder);
router.get("/me", authController.authenticate, orderController.getOrder);
router.get("/", authController.authenticate, orderController.getOrderList);
router.put("/:id", authController.authenticate, authController.checkAdminPermission, orderController.updateOrder);

module.exports = router;
const express =require('express');
const authController = require("../controller/auth.controller");
const cartController = require("../controller/cart.controller");
const router = express.Router();

//카트 추가
router.post("/", authController.authenticate, cartController.addItemToCart);
//카트 조회
router.get("/", authController.authenticate,  cartController.getCart);
//카트 제거
router.delete("/:id", authController.authenticate, cartController.deleteCartItem);
router.put("/:id", authController.authenticate, cartController.editCartItem);
router.get("/qty", authController.authenticate, cartController.getCartQty);

module.exports = router;
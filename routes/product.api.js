const express =require('express');
const productController = require("../controller/product.controller");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const router = express.Router();

// 상품생성
router.post("/", authController.authenticate, authController.checkAdminPermission, productController.createProduct);
router.get("/", productController.getProduct);

module.exports = router;

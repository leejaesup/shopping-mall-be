const express =require('express');
const productController = require("../controller/product.controller");
const authController = require("../controller/auth.controller");
const router = express.Router();

// 상품생성
router.post("/", authController.authenticate, authController.checkAdminPermission, productController.createProduct);
// 상품조회
router.get("/", productController.getProduct);
router.get("/:id", productController.getProductById);
// 상품수정
router.put("/:id", authController.authenticate, authController.checkAdminPermission, productController.updateProduct);
// 상품삭제
router.delete("/:id", authController.authenticate, authController.checkAdminPermission, productController.deleteProduct);

module.exports = router;
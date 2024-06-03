const express =require('express');
const productController = require("../controller/product.controller");
const userController = require("../controller/user.controller");
const authController = require("../controller/auth.controller");
const router = express.Router();

// 회원가입(POST)
router.post("/", authController.authenticate, authController.checkAdminPermission, productController.createProduct);
router.get("/me", authController.authenticate, userController.getUser);

module.exports = router;

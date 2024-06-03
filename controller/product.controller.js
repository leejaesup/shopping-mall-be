const User = require("../model/User");
const bcrypt = require('bcryptjs');
const Product = require("../model/Product");
const saltRounds = 10;

const productController = {};

//상품 생성
productController.createProduct = async (req, res) => {
    try {
        const {sku, name, size, image, category, description, price, stock, status} = req.body;
        const product = new Product({sku, name, size, image, category, description, price, stock, status});
        await product.save();

        //200 Ok
        res.status(200).json({status: "success", product}); // 상품 생성이 완료되었습니다.
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

//유저정보 가져오기
productController.getUser = async (req, res) => {
    try {
        const {userId} = req; //req.userId;
        const user = await User.findById(userId);

        if (!user) {
            throw  new Error("can not found User");
        }

        //200 Ok
        res.status(200).json({status: "success", user});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = productController;

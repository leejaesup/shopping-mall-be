const Product = require("../model/Product");

const PAGE_SIZE = 5;
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
productController.getProduct = async (req, res) => {
    try {
        const {page, name} = req.query;

        // let productList;
        // if (name) {
        //     productList = await Product.find({name: {$regex:name, $option:"i"}});
        // } else {
        //     productList = await Product.find({});
        // }
        const condition = name ? {name: {$regex: name, $options: "i"}} : {};
        let query = Product.find(condition);
        let response = {state: "success"};

        if (page) {
            query.skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE);
            // 전체 페이지 수
            const totalItemNum = await Product.find(condition).count();
            const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

            response.totalPageNum = totalPageNum;
        }
        const productList = await query.exec();
        response.data = productList;

        //200 Ok
        // res.status(200).json({status: "success", data: productList});
        res.status(200).json(response);
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = productController;

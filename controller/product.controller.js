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

//상품정보 가져오기
productController.getProduct = async (req, res) => {
    try {
        const {page, name} = req.query;

        // let productList;
        // if (name) {
        //     productList = await Product.find({name: {$regex:name, $option:"i"}});
        // } else {
        //     productList = await Product.find({});
        // }
        // const condition = name ? {name: {$regex: name, $options: "i"}} : {};
        const condition = name
            ? {name: {$regex: name, $options: "i" }, isDeleted: false}
            : {isDeleted: false};
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

//상품 상세 조회
productController.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        console.log("productId = ", productId);
        console.log("product = ", product);

        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.")
        }

        //200 Ok
        res.status(200).json({status: "success", data: product}); // 상품 수정이 완료되었습니다.
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
};

//상품 생성
productController.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const {sku, name, size, image, price, description, category, stock, status} = req.body;
        const product = await Product.findByIdAndUpdate(
            {_id: productId},
            {sku, name, size, image, price, description, category, stock, status},
            {new: true}
            );

        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.")
        }

        //200 Ok
        res.status(200).json({status: "success", data: product}); // 상품 수정이 완료되었습니다.
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

//상품 제거
productController.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findByIdAndUpdate(
            {_id: productId},
            {isDeleted: true}
            );

        if (!product) {
            throw new Error("상품을 찾을 수 없습니다.")
        }

        //200 Ok
        res.status(200).json({status: "success", product}); // 상품 제거가 완료되었습니다.
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = productController;

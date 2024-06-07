const Order = require("../model/Order");
const productController = require("./product.controller");
const {randomStringGenerator} = require("../utils/randomStringGenerator");

const PAGE_SIZE = 5;
const orderController = {};

//주문 Item추가 (POST)
orderController.createOrder = async (req, res) => {
    try {
        const {userId} = req;
        const {shipTo, contact, totalPrice, orderList} = req.body;

        //재고 확인, 재고 업데이트
        const insufficientStockItems = await productController.checkItemListStock(orderList);

        //재고가 충분하지 않을 경우
        if (insufficientStockItems.length > 0) {
            const errorMessage = insufficientStockItems.reduce((total, item) => total += item.message, "")
            throw new Error(errorMessage);
        }

        //유저를 가지고 카트 찾기
        const newOrder = new Order({
            userId,
            totalPrice,
            shipTo,
            contact,
            items: orderList,
            orderNum: randomStringGenerator(),
        });

        await newOrder.save();
        //200 Ok
        res.status(200).json({status: "success", orderNum: newOrder.orderNum});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

orderController.getOrder = async (req, res, next) => {
    try {
        const {userId} = req;

        const orderList = await Order.find({userId: userId}).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
                select: "image name",
            },
        });
        const totalItemNum = await Order.find({userId: userId}).count();

        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);

        //200 Ok
        res.status(200).json({status: "success", data: orderList, totalPageNum});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", error: error.message});
    }
};

orderController.getOrderList = async (req, res, next) => {
    try {
        const {page, orderNum} = req.query;

        let condition = {};
        if (orderNum) {
            condition = {
                orderNum: { $regex: orderNum, $options: "i" },
            };
        }

        const orderList = await Order.find(condition)
            .populate("userId")
            .populate({
                path: "items",
                populate: {
                    path: "productId",
                    model: "Product",
                    select: "image name",
                },
            })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE);

        const totalItemNum = await Order.find(condition).count();

        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        //200 Ok
        res.status(200).json({status: "success", data: orderList, totalPageNum});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
};

orderController.updateOrder = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {status} = req.body;
        const order = await Order.findByIdAndUpdate(id, {status: status}, {new: true});

        if (!order) {
            throw new Error("주문을 찾을 수 없습니다.");
        }

        //200 Ok
        res.status(200).json({status: "success", data: order});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
};
module.exports = orderController;

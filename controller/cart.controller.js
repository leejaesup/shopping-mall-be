const Cart = require("../model/Cart");

const cartController = {};

//카트 Item추가 (POST)
cartController.addItemToCart = async (req, res) => {
    try {
        const {userId} = req;
        const {productId, size, qty} = req.body;

        let cart = await Cart.findOne({userId});

        if (!cart) {
            cart = new Cart({userId});
            await cart.save();
        }

        const existItem = cart.items.find(
            (item) => item.productId.equals(productId) && item.size === size
        );

        if (existItem) {
            throw new Error("아이템이 이미 카트에 담겨 있습니다.");
        }

        cart.items = [...cart.items, {productId, size, qty}];
        await cart.save();

        //200 Ok
        return res.status(200).json({status: "ok", data: cart, cartItemQty: cart.items.length});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
};

cartController.getCart = async (req, res) => {
    try {
        const {userId } = req;

        const cart = await Cart.findOne({userId}).populate({
            path: "items",
            populate: {path: "productId", model: "Product" },
        });

        if (!cart) {
            throw new Error("카트가 비어있습니다.");
        }

        //200 Ok
        return res.status(200).json({status: "ok", data: cart.items, cartItemQty: cart.items.length});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
};

cartController.editCartItem = async (req, res) => {
    try {
        const { userId } = req;
        const { id } = req.params;

        const { qty } = req.body;
        const cart = await Cart.findOne({ userId }).populate({
            path: "items",
            populate: {
                path: "productId",
                model: "Product",
            },
        });

        if (!cart) {
            throw new Error("카트가 비었습니다.");
        }

        const index = cart.items.findIndex((item) => item._id.equals(id));
        if (index === -1) {
            throw new Error("제품을 찾을 수 없습니다.");
        }

        if (cart.items[index].qty <= qty) {
            throw new Error("재고 수량보다 많을 수 없습니다.");
        }

        cart.items[index].qty = qty;
        await cart.save();
        res.status(200).json({ status: 200, data: cart.items });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

cartController.deleteCartItem = async (req, res) => {
    try {
        const {id} = req.params;
        const {userId} = req;
        const cart = await Cart.findOne({userId});
        cart.items = cart.items.filter((item) => !item._id.equals(id));

        await cart.save();
        res.status(200).json({ status: 200, cartItemQty: cart.items.length });
    } catch (error) {
        return res.status(400).json({ status: "fail", error: error.message });
    }
};

cartController.getCartQty = async (req, res) => {
    try {
        const {userId } = req;

        const cart = await Cart.findOne({userId});
        if (!cart) {
            throw new Error("카트가 비어있습니다.");
        }

        return res.status(200).json({status: "ok", qty: cart.items.length});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
};

module.exports = cartController;

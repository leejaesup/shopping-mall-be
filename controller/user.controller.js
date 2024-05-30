const User = require("../model/User");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const userController = {};

//회원가입(POST)
userController.createUser = async (req, res) => {
    try {
        let {email, password, name, level} = req.body;

        // 존재하는 계정인지 확인
        const user = await User.findOne({email})

        if (user) {
            throw new Error('이미 가입된 정보입니다.');
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        password = await bcrypt.hash(password, salt);
        const newUser = new User({email, password, name, level: level? level : 'customer'});
        await newUser.save();

        //200 Ok
        res.status(200).json({status: "success"}); // 가입이 완료되었습니다.
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

//유저정보 가져오기
userController.getUser = async (req, res) => {
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

module.exports = userController;

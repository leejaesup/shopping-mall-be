const authController = {};
const jwt = require('jsonwebtoken');
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const userController = require("./user.controller");
const {OAuth2Client} = require("google-auth-library");
const e = require("express");
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;


//로그인(POST)
authController.loginWithEmail = async (req, res) => {
    try {
        const {email, password} = req.body;

        // 존재하는 계정인지 확인
        let user = await User.findOne({email}, "-createdAt -updatedAt -__v");

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = await user.generateToken();
                //200 Ok
                return res.status(200).json({status: "success", user, token});
            }
        }

        throw new Error('email 또는 비밀번호가 일치하지 않습니다.');
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

authController.loginWithGoogle = async (req, res) => {
    try {
        const {token} = req.body;
        const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: GOOGLE_CLIENT_ID
        });

        const {email, name} = ticket.getPayload();

        // 존재하는 계정인지 확인
        let user = await User.findOne({email});
        console.log("user = ", user);

        if (!user) {
            // 유저를 새로 생성
            const randomPassword = "" + Math.floor(Math.random() * 1000000);
            const salt = await bcrypt.genSalt(10);
            const newPassword = await bcrypt.hash(randomPassword, salt);

            user = new User({
                name,
                email,
                password: newPassword
            });
            await user.save();
        }

        //토큰 발행
        const sessionToken = await user.generateToken();
        //200 Ok
        return res.status(200).json({status: "success", user, token: sessionToken});
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

//인증
authController.authenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if (!tokenString) {
            throw new Error("Token Not Found");
        }

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if (error) {
                throw new Error("invalid Token");
            }
            req.userId = payload._id;
        });

        next();
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const {userId} = req;

        const user = await User.findById(userId);
        console.log(user)
        if (user.level !== "admin") {
            throw new Error("permission denied");
        }
        next();
    } catch (error) {
        //400 Bad Request
        res.status(400).json({status: "fail", message: error.message});
    }
}

module.exports = authController;

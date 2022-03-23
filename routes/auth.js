const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middlewares/auth-middleware');
const authController = require('../controller/auth')
const { upload } = require('../middlewares/upload')
const imageUploader = upload.single('imageFile')

const { ROUTE } = require("../config/constants");

router.get(ROUTE.AUTH.KAKAO, passport.authenticate('kakao'))

router.get(ROUTE.AUTH.KAKAO_CALLBACK, authController.kakaoCallback);

router.get(ROUTE.AUTH.GET_USERS_INFOMATION, authMiddleware, authController.getUserInfo);

router.get(ROUTE.AUTH.GET_MY_INFOMATION, authMiddleware, authController.getMyInfo);

router.post(ROUTE.AUTH.UPDATE_MY_INFOMATION, authMiddleware, imageUploader , authController.updateUserInfo);

router.delete(ROUTE.AUTH.WITHDRAW,  authMiddleware, authController.withdrawalUser)

module.exports = router;

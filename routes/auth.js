const express = require('express');
const router = express.Router();
// Library
const passport = require('passport');

// Controllers
const authController = require('../controller/auth')

// MiddleWares
const authMiddleware = require('../middlewares/auth-middleware');
const { upload } = require('../middlewares/upload')
const imageUploader = upload.single('imageFile')

// Constants
const { ROUTE } = require("../config/constants");

// 카카오 로그인
router.get(ROUTE.AUTH.KAKAO, passport.authenticate('kakao'))
// 카카오 로그인 콜백
router.get(ROUTE.AUTH.KAKAO_CALLBACK, authController.kakaoCallback);
// 상대방 공개 여행 목록 가져오기
router.get(ROUTE.AUTH.GET_USERS_INFOMATION, authMiddleware, authController.getUserInfo);
// 유저 정보 조회
router.get(ROUTE.AUTH.GET_MY_INFOMATION, authMiddleware, authController.getMyInfo);
// 유저 정보 수정
router.post(ROUTE.AUTH.UPDATE_MY_INFOMATION, authMiddleware, imageUploader , authController.updateUserInfo);
// 유저 정보 삭제
router.delete(ROUTE.AUTH.WITHDRAW,  authMiddleware, authController.withdrawalUser)
// 로컬 회원가입
router.post(ROUTE.AUTH.SIGN_UP, authMiddleware,authController.signUpUser);
// 이메일 중복체크
router.post(ROUTE.AUTH.CHECK_EMAIL, authMiddleware, authController.checkDuplicateEmail);
// 로컬 로그인
router.post(ROUTE.AUTH.SIGN_IN, authMiddleware, authController.signInUser);

module.exports = router;

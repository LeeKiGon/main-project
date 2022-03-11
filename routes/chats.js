//보이스

const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat')
// // const { voiceMulter, imageMulter } = require("../middleware/uploader");
// // const trackUploader = voiceMulter.single("trackFile");
// // const imageUploader = imageMulter.single("image");

const authMiddleware = require('../middlewares/auth-middleware');

// const { ROUTE } = require("../config/constants");

// 채팅방 목록 가져오기
router.get('/chat/list', authMiddleware, chatController.getChatListByUserId);

// 신규 채팅 확인
router.get('/chat/new', authMiddleware, chatController.checkNewChat);

// 해당 채팅방 내용 가져오기
router.get('/chat/:toSnsId', authMiddleware, chatController.getChatMessageByIds);

// 채팅으로 이미지파일 보내기
// // router.post(ROUTE.CHAT.IMAGE, imageUploader, chatController.postImage);

module.exports = router;

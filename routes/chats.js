const express = require('express');
const router = express.Router();
const chatController = require('../controller/chat')
const { ROUTE } = require('../config/constants');
const authMiddleware = require('../middlewares/auth-middleware');

// // const imageUploader = imageMulter.single("image");

// 채팅방 목록 가져오기
router.get(ROUTE.CHAT.GET_MY_CHATROOMLIST, authMiddleware, chatController.getChatListByUserId);

// 신규 채팅 확인
router.get(ROUTE.CHAT.GET_MY_NEWCHAT, authMiddleware, chatController.checkNewChat);

// 해당 채팅방 내용 가져오기
router.get(ROUTE.CHAT.GET_MY_CHATMESSAGE, authMiddleware, chatController.getChatMessageByIds);

// 채팅방 삭제
router.delete(ROUTE.CHAT.DELETE, authMiddleware, chatController.deletechatroom);

// 채팅으로 이미지파일 보내기
// router.post(ROUTE.CHAT.IMAGE, imageUploader, chatController.postImage);

module.exports = router;

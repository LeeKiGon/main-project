const express = require('express');
const router = express.Router();

// Controllers
const chatController = require('../controller/chat')

// Middlewares
const authMiddleware = require('../middlewares/auth-middleware');

// Constants
const { ROUTE } = require('../config/constants');

// 채팅방 목록 가져오기
router.get(ROUTE.CHAT.GET_MY_CHATROOMLIST, authMiddleware, chatController.getChatListByUserId);
// 해당 채팅방 내용 가져오기
router.get(ROUTE.CHAT.GET_MY_CHATMESSAGE, authMiddleware, chatController.getChatMessageByIds);
// 채팅방 삭제
router.delete(ROUTE.CHAT.DELETE, authMiddleware, chatController.deletechatroom);

module.exports = router;

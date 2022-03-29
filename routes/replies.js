const express = require('express');
const router = express.Router();

// Controllers
const ReplyController = require('../controller/replies');

// Middlewares
const authMiddleware = require('../middlewares/auth-middleware');

// Constants
const { ROUTE } = require('../config/constants');

// 답글 작성
router.post(ROUTE.REPLIES.ADD, authMiddleware, ReplyController.postReply);
// 답글 삭제
router.delete(ROUTE.REPLIES.DELETE, authMiddleware, ReplyController.deleteReply);
// 답글 수정
router.patch(ROUTE.REPLIES.UPDATE, authMiddleware, ReplyController.changeReply);

module.exports = router;

const express = require('express');
const router = express.Router();
const ReplyController = require('../controller/replies');
//스키마
const Reply = require('../models/reply');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
const { ROUTE } = require('../config/constants');

//여행 댓글에 답글 작성
router.post(ROUTE.REPLIES.ADD, authMiddleware, ReplyController.postReply);

//여행 댓글에 답글 삭제
router.delete(ROUTE.REPLIES.DELETE, authMiddleware, ReplyController.deleteReply);

//답글 수정
router.patch(ROUTE.REPLIES.UPDATE, authMiddleware, ReplyController.changeReply);

module.exports = router;

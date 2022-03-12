const express = require('express');
const router = express.Router();
const { ROUTE } = require('../config/constants');

//컨트롤러
const CommentController = require('../controller/comment');

//스키마
const Comment = require('../models/comment');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');

//여행에 달린 댓글 조회
router.get(ROUTE.COMMENT.FIND, authMiddleware, CommentController.findComment);

//여행 댓글 작성
router.post(ROUTE.COMMENT.WRITE, authMiddleware, CommentController.writeComment);

//여행 댓글 수정
router.patch(ROUTE.COMMENT.UPDATE, authMiddleware, CommentController.changeComment);

//여행 댓글 삭제    
router.delete(ROUTE.COMMENT.DELETE, authMiddleware, CommentController.deleteComment);

module.exports = router;
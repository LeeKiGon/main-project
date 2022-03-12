const express = require('express');
const router = express.Router();
const { ROUTE } = require('../config/constants');

//컨트롤러
const likeController = require('../controller/like');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');

// 특정 여행 좋아요
router.post(ROUTE.LIKE.LIKEPLAN, authMiddleware, likeController.addLike);

// 특정 여행 좋아요 취소
router.delete(ROUTE.LIKE.LIKEPLAN, authMiddleware, likeController.cancelLike);

//여행 댓글 좋아요
router.post(ROUTE.LIKE.LIKECOMMENT, authMiddleware, likeController.addLike);

// 여행 댓글 좋아요 취소
router.delete(ROUTE.LIKE.LIKECOMMENT,authMiddleware,likeController.cancelLike);

//답글 좋아요
router.post(ROUTE.LIKE.LIKEREPLY, authMiddleware, likeController.addLike);

// 답글 좋아요 취소
router.delete(ROUTE.LIKE.LIKEREPLY, authMiddleware, likeController.cancelLike);

module.exports = router;

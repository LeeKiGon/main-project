const express = require('express');
const router = express.Router();

// Controllers
const likeController = require('../controller/like');

// MiddleWares
const authMiddleware = require('../middlewares/auth-middleware');

// Constants
const { ROUTE } = require('../config/constants');

// 특정 여행 좋아요
router.post(ROUTE.LIKE.LIKEPLAN, authMiddleware, likeController.addLike);
// 특정 여행 좋아요 취소
router.delete(ROUTE.LIKE.LIKEPLAN, authMiddleware, likeController.cancelLike);
// 여행 댓글 좋아요
router.post(ROUTE.LIKE.LIKECOMMENT, authMiddleware, likeController.addLike);
// 여행 댓글 좋아요 취소
router.delete(ROUTE.LIKE.LIKECOMMENT,authMiddleware,likeController.cancelLike);
// 답글 좋아요
router.post(ROUTE.LIKE.LIKEREPLY, authMiddleware, likeController.addLike);
// 답글 좋아요 취소
router.delete(ROUTE.LIKE.LIKEREPLY, authMiddleware, likeController.cancelLike);

module.exports = router;

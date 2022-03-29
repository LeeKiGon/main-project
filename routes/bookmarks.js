const express = require('express');
const router = express.Router();

// Controllers
const bookmarkController = require('../controller/bookmark');

// MiddleWares
const authMiddleware = require('../middlewares/auth-middleware');

// Constants
const { ROUTE } = require('../config/constants');

// 북마크 여행 불러오기
router.get(ROUTE.BOOKMARK.FIND,authMiddleware,bookmarkController.findBookmark);
// 특정 여행 북마크 추가
router.post(ROUTE.BOOKMARK.BOOKMARKPLAN, authMiddleware, bookmarkController.addBookmark);
// 특정 여행 북마크 취소
router.delete(ROUTE.BOOKMARK.BOOKMARKPLAN, authMiddleware, bookmarkController.cancelBookmark);

module.exports = router;

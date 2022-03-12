const express = require('express');
const router = express.Router();
const { ROUTE } = require('../config/constants');

//컨트롤러
const bookmarkController = require('../controller/bookmark');

//스키마
const Bookmark = require('../models/bookmark');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');

// 북마크 여행 불러오기
router.get(ROUTE.BOOKMARK.FIND,authMiddleware,bookmarkController.findBookmark);

// 특정 여행 북마크 추가
router.post(ROUTE.BOOKMARK.BOOKMARKPLAN, authMiddleware, bookmarkController.addBookmark);

// 특정 여행 북마크 취소
router.delete(ROUTE.BOOKMARK.BOOKMARKPLAN, authMiddleware, bookmarkController.cancelBookmark);

module.exports = router;

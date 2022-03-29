const express = require('express');
const router = express.Router();

// Controllers
const noticeController = require('../controller/notice');

// MiddleWares
const authMiddleware = require('../middlewares/auth-middleware');

// Constants
const { ROUTE } = require('../config/constants');

// 알림 페이지 확인
router.get(ROUTE.NOTICE.GET_MY, authMiddleware, noticeController.getAllNotice);
// 특정 알람 삭제
router.delete(ROUTE.NOTICE.DELETE, authMiddleware, noticeController.deleteOneNotice);
// 모든 알람 삭제
router.delete(ROUTE.NOTICE.DELETE_ALL, authMiddleware, noticeController.deleteAllNotice);

module.exports = router;

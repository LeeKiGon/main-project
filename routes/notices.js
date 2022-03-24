const express = require('express');
const router = express.Router();
const { ROUTE } = require('../config/constants');

const noticeController = require('../controller/notice');

const authMiddleware = require('../middlewares/auth-middleware');

// 새로운 알람 확인
router.get(ROUTE.NOTICE.GET_MY, authMiddleware, noticeController.getAllNotice);

// 특정 알람 삭제
router.delete(ROUTE.NOTICE.DELETE_NOTICE, authMiddleware, noticeController.deleteOneNotice);

// 모든 알람 삭제
router.delete(ROUTE.NOTICE.DELETE_ALL_NOTICE, authMiddleware, noticeController.deleteAllNotice);

module.exports = router;

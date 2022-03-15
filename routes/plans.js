const express = require('express');
const router = express.Router();
const planController = require('../controller/plan');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
const { upload } = require('../middlewares/upload');
const imageUploder = upload.single('imageFile');

const { ROUTE } = require('../config/constants');

// 전체 여행 불러오기
router.get(ROUTE.PLAN.GET_ALL, authMiddleware, planController.getAllPlans);

// 여행 생성하기
router.post(ROUTE.PLAN.ADD, authMiddleware, planController.addNewPlan);

// 특정여행 불러오기
router.get(ROUTE.PLAN.GET, authMiddleware, planController.getPlanByPlanId);

// 공개 / 비공개 설정
router.post(ROUTE.PLAN.CHANGE_STATUS, authMiddleware, planController.changePlanStatus);

// 특정 여행 삭제
router.delete(ROUTE.PLAN.DELETE, authMiddleware, planController.deletePlan);

// 썸네일 사진 추가하기
router.post(ROUTE.PLAN.ADD_THUMBNAIL, authMiddleware, imageUploder, planController.addNewThumbnail);

// 나의 여행불러오기
router.get(ROUTE.PLAN.GET_MY, authMiddleware, planController.getMyPlans);

module.exports = router;

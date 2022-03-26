const express = require('express');
const router = express.Router();
const planController = require('../controller/plan');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
const { upload } = require('../middlewares/upload');
const imageUploder = upload.single('imageFile');

const { ROUTE } = require('../config/constants');

// 이번달 북마크 검색
router.get(
    ROUTE.PLAN.GET_HOT_BOOKMARK,
    authMiddleware,
    planController.getMostBookMarkedPlans
);

// 이번달 좋아요 검색
router.get(
    ROUTE.PLAN.GET_HOT_LIKE,
    authMiddleware,
    planController.getMostLikedPlans
);

// 여행 검색하기
router.get(ROUTE.PLAN.SEARCH, authMiddleware, planController.searchPlan);

// 전체 여행 불러오기
router.get(ROUTE.PLAN.GET_ALL, authMiddleware, planController.getAllPlans);

// 여행 생성하기
router.post(ROUTE.PLAN.ADD, authMiddleware, planController.addNewPlan);

// 특정여행 불러오기
router.get(ROUTE.PLAN.GET, authMiddleware, planController.getPlanByPlanId);

// 공개 / 비공개 설정
router.post(
    ROUTE.PLAN.CHANGE_STATUS,
    authMiddleware,
    planController.changePlanStatus
);

// 특정 여행 삭제
router.delete(ROUTE.PLAN.DELETE, authMiddleware, planController.deletePlan);

// 썸네일 사진 추가하기
router.post(
    ROUTE.PLAN.ADD_THUMBNAIL,
    authMiddleware,
    imageUploder,
    planController.addNewThumbnail
);

// 나의 여행불러오기
router.get(ROUTE.PLAN.GET_MY, authMiddleware, planController.getMyPlans);

// 여행 수정하기
router.patch(ROUTE.PLAN.UPDATE, authMiddleware, planController.updatePlanInfo);

// 여행 복사하기
router.post(ROUTE.PLAN.COPY, authMiddleware, planController.copyPlan);

module.exports = router;

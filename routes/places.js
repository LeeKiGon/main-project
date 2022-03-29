const express = require('express');
const router = express.Router();

// Controllers
const placesController = require('../controller/places');

// MiddleWares
const authMiddleware = require('../middlewares/auth-middleware');
const { upload } = require('../middlewares/upload');
const imageUploder = upload.fields([{ name: 'imageFile', maxCount: 10 }])

// Constants
const { ROUTE } = require('../config/constants');

// 특정 여행에 장소 추가하기
router.post(ROUTE.PLACES.ADD, authMiddleware, imageUploder, placesController.postplaces);
// 여행 장소 및 내용 수정하기
router.post(ROUTE.PLACES.UPDATE, authMiddleware, imageUploder, placesController.patchplaces);
// 특정 장소 삭제하기
router.delete(ROUTE.PLACES.DELETE, authMiddleware, placesController.deleteplaces);
// 여행 일정 사진 삭제하기
router.delete(ROUTE.PLACES.IMAGE_DELETE, authMiddleware, placesController.deletePlaceImage);

module.exports = router;
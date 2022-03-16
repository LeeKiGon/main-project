const express = require('express');
const router = express.Router();
const placesController = require('../controller/places');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
const { upload } = require('../middlewares/upload');
// const { deleteS3 } = require('../middlewares/deleteS3');
const { ROUTE } = require('../config/constants');

//특정 여행에 장소 추가하기
router.post(ROUTE.PLACES.ADD, authMiddleware, upload.fields([
    // { name: 'videoFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 10 },
]), placesController.postplaces);

//여행 장소 및 내용 수정하기
router.post(ROUTE.PLACES.UPDATE, authMiddleware, upload.fields([
    // { name: 'videoFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 10 },
]), placesController.patchplaces);

//특정 장소 삭제하기
router.delete(ROUTE.PLACES.DELETE, authMiddleware, placesController.deleteplaces)

module.exports = router;

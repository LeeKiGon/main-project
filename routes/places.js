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
router.patch(ROUTE.PLACES.UPDATE, authMiddleware, upload.fields([
    // { name: 'videoFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 10 },
]), placesController.patchplaces);
//특정 장소 삭제하기
router.delete(ROUTE.PLACES.DELETE, authMiddleware, placesController.deleteplaces)
// router.post('/plans/days/:dayId', upload.fields([
//         // { name: 'videoFile', maxCount: 1 },
//         { name: 'imageFile', maxCount: 10 },
//     ]),
//     async (req, res) => {
//         const { dayId } = req.params;
//         const { placeName, lat, lng, address, time, memoText } = req.body;

//         // let videoUrl = [];
//         let imageUrl = [];

//         // req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
//         req.files.imageFile ? (imageUrl = req.files.imageFile) : imageUrl;

//         const findDay = await Day.findOne({ _id: dayId });
//         const findPlan = await Plan.findOne({ _id: findDay.planId });

//         if (findPlan.destination === '국내') {
//             const splited = address.split(' ');
//             findPlan.locations.push(splited[1]);
//             findPlan.locations.push(splited[2]);
//         }
//         if (findPlan.destination === '해외') {
//             const country = address.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/)[0]; //배열에서 한글(정규표현식) 찾아서 변수에 담기
//             findPlan.locations.push(country);
//         }

//         findPlan.locations = [...new Set(findPlan.locations)]; // Set 자료형 사용하여 배열 내 중복값 제거 후 ...(Spread 연산자)로 List 로 변경

//         await findPlan.save();

//         const newPlace = new Place({
//             planId: findDay.planId,
//             dayId,
//             placeName,
//             time,
//             lat,
//             lng,
//             address,
//             memoText,
//         });

//         // for(let i=0; i< videoUrl.length; i++) {
//         //     newPlace.memoImage.push(videoUrl[i].location)
//         // }
//         for (let i = 0; i < imageUrl.length; i++) {
//             newPlace.memoImage.push(imageUrl[i].location);
//         }
//         if (memoText) newPlace.memoText = memoText;

//         await newPlace.save();

//         // const newDayFind = await Day.findOne({_id: dayId}).populate('places')
//         // console.log("newDayFind :",newDayFind)

//         res.json({
//             // newDayFind,
//             result: 'success',
//             message: '추가 완료 되었습니다.',
//         });
//     }
// );

//여행 장소 및 내용 수정하기
// router.post(
//     '/plans/days/places/:placeId',
//     authMiddleware,
//     upload.fields([
//         // { name: 'videoFile', maxCount: 1 },
//         { name: 'imageFile', maxCount: 10 },
//     ]),
//     async (req, res) => {
//         const { placeId } = req.params;
//         const { placeName, lat, lng, address, time, memoText } = req.body;

//         // let videoUrl = [];
//         let imageUrl = [];

//         // req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
//         req.files.imageFile ? (imageUrl = req.files.imageFile) : imageUrl;

//         const findPlace = await Place.findOneAndUpdate(
//             { _id: placeId },
//             { placeName, lat, lng, address, time, memoText }
//         );

//         // for(let i=0; i< videoUrl.length; i++) {
//         //     findPlace.memoImage.push(videoUrl[i].location)
//         // }

//         for (let i = 0; i < imageUrl.length; i++) {
//             findPlace.memoImage.push(imageUrl[i].location);
//         }

//         if (memoText) updatePlace.memoText = memoText;

//         await findPlace.save();
//         res.json({ result: 'success', message: '수정 완료 되었습니다.' });
//     }
// );

//특정 장소 삭제하기
    // async (req, res) => {
    //     const { placeId } = req.params;
    //     await Place.deleteOne({ _id: placeId });
    //     res.json({
    //         result: 'success',
    //         message: '삭제 완료',
    //     });
    // }
// );

module.exports = router;

const express = require('express');
const router = express.Router();

//스키마
const User = require('../schemas/user');
const Plan = require('../schemas/plan');
const Reply = require('../schemas/reply');
const Like = require('../schemas/like');
const Bookmark = require('../schemas/bookmark');
const Place = require('../schemas/place');
const Day = require('../schemas/day');
const Comments = require('../schemas/comment');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
const { upload } = require('../middlewares/upload')
const { deleteS3 } = require('../middlewares/deleteS3')

/* 메인 페이지 */
// 전체 여행 불러오기
router.get('/plans', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    let { page } = req.query;
    console.log(page)
    page === undefined ? page = 1 : +page;
    const numPlans = await Plan.count({status : '공개'})
    console.log(numPlans) // 전체 포스트 갯수
    const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5); // 5로 나눠서 필요한 페이지 갯수 구하기
    const findPage = await Plan.find({status:'공개'}).sort('-createdAt').skip(5 * (page - 1)).limit(5).populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img')

    const plansLikeBookmark = await Plan.findLikeBookmark(findPage, user);

    res.json({ plans: plansLikeBookmark, endPage });
});

// 북마크 여행 불러오기
router.get('/plans/bookmark', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;

    const findBookmarks = await Bookmark.find({ userId });

    res.json({ plans: findBookmarks });
});

// 특정 여행 북마크 추가
router.post('/plans/:planId/bookmark', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;

    const findBookmark = await Bookmark.findOne({planId, userId })
    if(findBookmark !== null) {
        return res.status(401).json({result:'fail', message:'이미 북마크 추가했습니다.'})
    }


    const newBookmark = await Bookmark.create({
        userId,
        planId,
    });
    res.json({
        result: 'success',
        message: '성공',
    });
});

// 특정 여행 북마크 취소
router.delete('/plans/:planId/bookmark', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;


    const findBookmark = await Bookmark.findOne({planId, userId })
    if(findBookmark !== null) {
        return res.status(401).json({result:'fail', message:'이미 북마크 취소했습니다.'})
    }

        await Bookmark.deleteOne({ 
            userId,
            planId 
        })
        
        res.json({
            result: "success",
            message: "성공"
        })
    }
);

// 특정 여행 좋아요
router.post('/plans/:planId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;


    const findLike = await Like.findOne({planId, userId })
    if(findLike !== null) {
        return res.status(401).json({result:'fail', message:'이미 좋아요했습니다.'})
    }
    
    const newLike = await Like.create({
        userId,
        planId,
    });
    res.json({
        result: 'success',
        message: '성공',
    });
});

// 특정 여행 좋아요 취소
router.delete('/plans/:planId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;


    const findLike = await Like.findOne({planId, userId })
    if(findLike !== null) {
        return res.status(401).json({result:'fail', message:'이미 좋아요 취소했습니다.'})
    }

    await Like.deleteOne({
        userId,
        planId,
    });

    
    res.json({
        result: 'success',
        message: '성공',
    });
});

/* 여행 후기,작성 페이지 */
// 여행 생성하기
router.post('/plans', authMiddleware, async (req, res) => {
    const { userId, nickname } = res.locals.user;
    const { title, startDate, endDate, destination, style, withlist } = req.body;
    const newPlan = new Plan({
        userId,
        nickname,
        title,
        startDate,
        endDate,
        destination,
        style,
        withlist
    });

    // 여행일정 day 계산 후 저장
    const sDate = new Date(startDate);
    const eDate = new Date(endDate); 

    const diffDate = sDate.getTime() - eDate.getTime();
    const dateDays = Math.abs(diffDate / (1000 * 3600 * 24));
    console.log('dateDays', dateDays);
    await newPlan.save();

    for (let i = 1; i <= dateDays + 1; i++) {
        const newDay = await Day.create({
            planId: newPlan._id,
            dayNumber: i,
        });
        console.log(`day${i} 생성 완료`);
    }

    res.json({
        result: 'success',
        message: "성공", 
        planId: newPlan.planId });
});

//특정 여행 받아오기
router.get('/plans/:planId', authMiddleware, async (req, res) => {
    const { user } = res.locals
    const { planId } = req.params;
    const plan = await Plan.findOne({_id : planId }).populate({
        path: 'days',
        populate: { path: 'places' },
    }).populate('userId likeCount bookmarkCount');

    const planLikeBookmark = await Plan.findLikeBookmark([plan], user)

    res.json({ 
        result: 'success',
        message: "성공", 
        plan : planLikeBookmark[0]
    });
});

// 공개 or 비공개 컨트롤하기
router.post('/plans/:planId/public', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;
    const { status } = req.body;

    const findPlan = await Plan.findOne({ _id: planId })
    if(findPlan.userId !== userId) {
        return res.status(401).json({ result: 'fail', message: '본인의 여행만 변경할수 있습니다.' });
    }

    findPlan.status = status;
    await findPlan.save();

    return res.status(200).json({ result : 'success', message: '변경 완료 되었습니다.' })
});

//특정 여행에 장소 추가하기
router.post('/plans/days/:dayId', upload.fields([
    // { name: 'videoFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 10 },
]), async (req, res) => {
    const { dayId } = req.params;
    const { placeName, lat, lng, address, time, memoText, address_components } = req.body;

    // let videoUrl = [];
    let imageUrl = [];

    // req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
    req.files.imageFile ? imageUrl = req.files.imageFile : imageUrl;
    // console.log(address_components);
    const findDay = await Day.findOne({ _id: dayId })
    console.log(findDay)
    const newPlace = new Place({
        planId : findDay.planId,
        dayId,
        placeName,
        time,
        lat,
        lng,
        address,
        memoText,
    });

    // for(let i=0; i< videoUrl.length; i++) {
    //     newPlace.memoImage.push(videoUrl[i].location)
    // }
    for(let i=0; i< imageUrl.length; i++) {
        newPlace.memoImage.push(imageUrl[i].location)
    }
    if (memoText) newPlace.memoText = memoText;

    await newPlace.save();

    // const newDayFind = await Day.findOne({_id: dayId}).populate('places')
    // console.log("newDayFind :",newDayFind)

    res.json({
        // newDayFind,
        result:'success',
        message: '추가 완료 되었습니다.'
    });
});

//여행 장소 및 내용 수정하기
router.patch('/plans/days/places/:placeId', authMiddleware, upload.fields([
    // { name: 'videoFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 10 },
]), async (req, res) => {
    const { placeId } = req.params;
    const { placeName, lat, lng, address, time, memoText } = req.body;

    // let videoUrl = [];
    let imageUrl = [];

    // req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
    req.files.imageFile ? imageUrl = req.files.imageFile : imageUrl;

    const findPlace = await Place.findOneAndUpdate({ _id: placeId }, { placeName, lat, lng, address, time, memoText})

    // for(let i=0; i< videoUrl.length; i++) {
    //     findPlace.memoImage.push(videoUrl[i].location)
    // }

    for(let i=0; i< imageUrl.length; i++) {
        findPlace.memoImage.push(imageUrl[i].location)
    }
    
    if (memoText) updatePlace.memoText = memoText;

    
    await findPlace.save();
    res.json({result:'success', message: '수정 완료 되었습니다.'});
});

//특정 장소 삭제하기
router.delete('/plans/days/places/:placeId', authMiddleware, async (req, res) => {
    const { placeId } = req.params;
    await Place.deleteOne({ _id: placeId });
    res.json({
        result: 'success',
        message: "삭제 완료"
    });
});

//여행 삭제하기
router.delete('/plans/:planId', authMiddleware, async (req, res) => {
    const { nickname } = res.locals.user;
    const { planId }  = req.params;

    const targetPlan = await Plan.findOne({ _id: planId, nickname });
    if (!targetPlan) {
        return res.json({ result: 'false' });
    } else {
        await Plan.deleteOne({ _id : planId });
        res.json({
            result: 'success',
            message: "삭제 완료"
        });
    }
});

/* 나의 여행 페이지 */
// 나의 여행 불러오기
router.get('/myplans', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;

    const findplans = await Plan.find({ userId });

    res.json({ plans : findplans });
});

module.exports = router;

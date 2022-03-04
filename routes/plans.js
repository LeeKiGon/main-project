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

/* 메인 페이지 */
// 전체 여행 불러오기
router.get('/plans', authMiddleware, async (req, res) => {
    const {user} = res.locals;
    const { page } = req.query;
    console.log(page)
    if(page) {
        +page
    } else page = 1;
    const numPlans = await Plan.estimatedDocumentCount(); // 전체 포스트 갯수
    const wholePages = numPlans === 0 ? 1 : Math.ceil(numPlans / 5); // 5로 나눠서 필요한 페이지 갯수 구하기
    // const pagingPlans = await Plan.find()
    //     .sort('-createdAt')
    //     .skip(5 * (page - 1))
    //     .limit(5)
    //     .populate('userId', 'snsId email nickname profile_img')
    //     .exec();

    const plansLikeBookmark = await Plan.findLikeBookmark(page, user);

    res.json({ plans: plansLikeBookmark });
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
    const { title, location, startDate, endDate, category } = req.body;
    const newPlan = new Plan({
        userId,
        nickname,
        title,
        location,
        startDate,
        endDate,
        category,
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
        planId: newPlan.plan_id });
});

//특정 여행 받아오기
router.get('/plans/:planId', async (req, res) => {
    const { planId } = req.params;
    const plan = await Plan.findOne({_id : planId }).populate({
        path: 'days',
        populate: { path: 'places' },
    }).populate('userId');
    res.json({ 
        result: 'success',
        message: "성공", 
        plan
     });
});

//특정 여행에 장소 추가하기
router.post('/plans/days/:dayId', async (req, res) => {
    const { dayId } = req.params;
    const { placeName, lat, lng, address } = req.body;

    const findDay = await Day.findOne({ _id: dayId })
    const newPlace = new Place({
        planId : findDay.planId,
        dayId,
        placeName,
        lat,
        lng,
        address,
    });
    await newPlace.save();
    res.json({});
});

//특정 여행에 장소 사진, 메모 추가하기
router.post('/plans/days/places/:placeId', upload.fields([
    { name: 'videoFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 5 },
]), async (req, res) => {
    const { placeId } = req.params;
    const { memoText } = req.body;

    let videoUrl = [];
    let imageUrl = [];

    req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
    req.files.imageFile ? imageUrl = req.files.imageFile : imageUrl;
    

    const updatePlace = await Place.findOne({_id: placeId})

    for(let i=0; i< videoUrl.length; i++) {
        updatePlace.memoImage.push(videoUrl[i].location)
    }
    

    for(let i=0; i< imageUrl.length; i++) {
        updatePlace.memoImage.push(imageUrl[i].location)
    }
    
    if (memoText) updatePlace.memoText = memoText;

    await updatePlace.save();


    res.json({
        result: 'success', 
        message: '추가 완료'
    })
})

//특정 장소 삭제하기
router.delete('/plans/days/places/:placeId', async (req, res) => {
    const { placeId } = req.params;
    await Place.deleteOne({ _id: placeId });
    res.json({
        result: 'success',
        message: "삭제 완료"
    });
});

//여행 삭제하기
router.delete('/plans/:planId', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const nickname = user.nickname;
    const planId = req.params;

    const targetPlan = await Plan.findOne({ _id: planId, nickname });
    if (!targetPlan) {
        return res.json({ result: 'false' });
    } else {
        await Plan.deleteOne({ planId });
        res.json({
            result: 'success',
            message: "삭제 완료"
        });
    }
});

module.exports = router;

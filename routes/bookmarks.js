const express = require('express');
const router = express.Router();

//스키마
const Bookmark = require('../models/bookmark');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
// const { countDocuments } = require('../models/user');

// 북마크 여행 불러오기
router.get('/plans/bookmark', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;

    const findBookmarks = await Bookmark.find({ userId }).populate({path : 'planId', populate: {path : 'userId'}})

    res.json({ plans: findBookmarks })
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
    if(findBookmark === null) {
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
module.exports = router;
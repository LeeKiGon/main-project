const express = require('express');
const router = express.Router();

//스키마
const Like = require('../models/like');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');

// 특정 여행 좋아요
router.post('/plans/:planId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;


    const findLike = await Like.findOne({ planId, userId })
    if(findLike !== null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요했습니다.'})
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

    const findLike = await Like.findOne({ planId, userId })
    if(findLike === null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요 취소했습니다.'})
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


//여행 댓글 좋아요
router.post('/plans/comments/:commentId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const findLike = await Like.findOne({ commentId, userId })
    if(findLike !== null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요했습니다.'})
    }

    const newLike = await Like.create({
        userId,
        commentId,
    });
    res.json({
        result: 'success',
        message: '성공',
    });
});

// 여행 댓글 좋아요 취소
router.delete('/plans/comments/:commentId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const findLike = await Like.findOne({ commentId, userId })
    if(findLike === null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요 취소했습니다.'});
    }

    await Like.deleteOne({
        userId,
        commentId,
    });

    
    res.json({
        result: 'success',
        message: '좋아요 취소 완료',
    });
})



//답글 좋아요
router.post('/plans/comments/replies/:replyId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { replyId } = req.params;
    
    const findLike = await Like.findOne({ replyId, userId })
    if(findLike !== null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요했습니다.'})
    }

    const newLike = await Like.create({
        userId,
        replyId,
    });
    res.json({
        result: 'success',
        message: '성공',
    });
});

// 답글 좋아요 취소
router.delete('/plans/comments/replies/:replyId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { replyId } = req.params;

    const findLike = await Like.findOne({ replyId, userId })
    if(findLike === null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요 취소했습니다.'})
    }

    await Like.deleteOne({
        userId,
        replyId,
    });

    
    res.json({
        result: 'success',
        message: '좋아요 취소 완료',
    });
})

module.exports = router;

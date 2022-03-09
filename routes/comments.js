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
const Comment = require('../schemas/comment');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');

//여행에 달린 댓글 조회
router.get('/plans/:planId/comments', async (req, res) => {
    const { planId } = req.params;
    const comments = await Comment.find({ planId }).populate('likeCount userId').populate({
        path: 'replies', populate :{ path : 'userId likeCount' }
    });
    res.json({ comments }); 
});

//여행 댓글 작성
router.post('/plans/:planId/comments', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { content } = req.body;
    const { planId } = req.params;
    
    const newComment = await Comment.create({
        userId,
        content,
        planId
    });
    
    // const comments = await Comment.find({ _id : newComment._id }).populate('likeCount userId').populate({
    //     path: 'replies', populate :{ path : 'userId' }
    // });    

    res.json({
        // newComment : comments,
        result: 'success',
        message: '성공',
    });
    
});

//여행 댓글 수정
router.patch('/plans/comments/:commentId', authMiddleware, async (req, res) => {
    const { userId }= res.locals.user;

    const { commentId } = req.params;
    const { content } = req.body;

    const targetComment = await Comment.findOne({ _id: commentId })
    if (targetComment.userId.toHexString() !== userId) {
        return res.status(401).json({ result: "false", message: "본인의 댓글만 수정할수있습니다"})
    }
    await Comment.updateOne({ _id: commentId }, {$set : { content }})
    res.json({
        result: "success",
        message: "성공"  
    })
})

//여행 댓글 삭제    
router.delete('/plans/comments/:commentId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const targetComment = await Comment.findOne({ _id : commentId });
    if (targetComment.userId.toHexString() !== userId) {
        return res.json({ result: 'false' , message: "본인의 댓글만 삭제할수있습니다"});
    } else {
        await Comment.deleteOne({ _id : commentId });
        res.json({
            result: 'success',
            message: "성공"
        });
    }
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
        return res.status(401).json({ result:'fail', message:'이미 좋아요 취소했습니다.'})
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


//답글 생성
router.post('/plans/comments/:commentId/reply', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { content } = req.body;
    const { planId, commentId } = req.params;
    
    const newReply = await Reply.create({
        userId,
        commentId,
        content,
        planId     
    });
    
    res.json({
        result: 'success',
        message: '성공',
    });
    
});


//답글 좋아요
router.post('/plans/comments/replies/:replyId/like', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { replyId } = req.params;
    
    const findLike = await Like.findOne({ replyId, userId })
    if(findLike !== null) {
        return res.status(401).json({ result:'fail', message:'이미 좋아요했습니다.'})
    }

    const newLike = await Like.create({
        uerIds,
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

//답글 수정
router.patch('/plans/comments/replies/:replyId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { replyId } = req.params;
    const { content } = req.body;

    const targetReply = await Reply.findOne({ _id : replyId })
    if (targetReply.userId.toHexString() !== userId) {
        return res.status(401).json({ result: "false", message: "본인의 댓글만 수정할수있습니다"})
    }
    await Reply.updateOne({ _id: replyId }, {$set : { content }})
    res.json({
        result: "success",
        message: "성공"  
    });
});

//여행 댓글에 답글 삭제
router.delete('/plans/comments/replies/:replyId', authMiddleware, async (req, res) => {
    const { userId } = res.locals.user;
    const { replyId } = req.params;

    const targetReply = await Reply.findOne({ _id: replyId });
    if (targetReply.userId.toHexString() !== userId) {
        return res.json({ result: 'false' , message: "본인의 댓글만 삭제할수있습니다"});
    } else {
        await Reply.deleteOne({ _id: replyId });
        res.json({
            result: 'success',
            message: "성공"
        });
    }
    
})
module.exports = router;
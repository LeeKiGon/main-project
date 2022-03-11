const express = require('express');
const router = express.Router();

//스키마
const Comment = require('../models/comment');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');


//여행에 달린 댓글 조회
router.get('/plans/:planId/comments', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { planId } = req.params;
    const comments = await Comment.find({ planId }).populate('likeCount userId').populate({
        path: 'replies', populate :{ path : 'userId likeCount' }
    });

    const commentLike = await Comment.findLike(comments, user)
    res.json({ comments: commentLike }); 
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

module.exports = router;
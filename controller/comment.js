const CommentService = require('../services/comment');

//여행에 달린 댓글 조회
const findComment = async (req, res) => {
    const { user } = res.locals;
    const { planId } = req.params;

    const getComment = await CommentService.getCommentByPlanId({ planId });
    const commentLike = await CommentService.getCommentLike(getComment, user);
    res.json({ comments: commentLike }); 
}

//여행 댓글 작성
const writeComment = async (req, res) => {
    const { userId } = res.locals.user;
    const { content } = req.body;
    const { planId } = req.params;
    
    await CommentService.createComment({
        userId,
        content,
        planId
    });

    res.json({
        result: 'success',
        message: '성공',
    });
    
};

//여행 댓글 수정
const changeComment = async (req, res) => {
    const { userId }= res.locals.user;
    const { commentId } = req.params;
    const { content } = req.body;

    const targetComment = await CommentService.getTargetComment({ commentId })
    if (targetComment.userId.toHexString() !== userId) {
        return res.status(401).json({ result: "false", message: "본인의 댓글만 수정할수있습니다"})
    }
    await CommentService.updateComment({commentId, content});
    res.json({
        result: "success",
        message: "성공"
    })
};

//여행 댓글 삭제    
const deleteComment = async (req, res) => {
    const { userId } = res.locals.user;
    const { commentId } = req.params;

    const targetComment = await CommentService.getTargetComment({ commentId })
    if (targetComment.userId.toHexString() !== userId) {
        return res.json({ result: 'false' , message: "본인의 댓글만 삭제할수있습니다"});
    }
    await CommentService.deleteComment({commentId});
    res.json({
        result: 'success',
        message: "성공"
    });
};

module.exports ={
    findComment,
    writeComment,
    changeComment,
    deleteComment
}
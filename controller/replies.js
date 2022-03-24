const ReplyService = require('../services/replies');
const NoticeService = require('../services/notice')

//댓글에 답글 작성
const postReply = async (req, res, next) => {
        const { user } = res.locals;
        const { content } = req.body;
        const { commentId } = req.params;

        const newReply = await ReplyService.createReply({
            userId: user.userId,
            content,
            commentId,
        });

        await NoticeService.createNewCommentReplyNoticeMessage({ sentUser: user , document: newReply, type: 'reply' });

        res.json({ 
            result: 'success', 
            message: '작성 완료' 
        });
};

//댓글에 답글 수정
const changeReply = async (req, res, next) => {
        const { userId } = res.locals.user;
        const { replyId } = req.params;
        const { content } = req.body;

        const targetReply = await ReplyService.getTargetReply({ replyId });
        if (targetReply.userId.toHexString() !== userId) {
            return res.status(401).json({
                result: 'false',
                message: '본인의 답글만 수정할수있습니다',
            });
        }
        await ReplyService.updateReply({ userId, content, replyId });

        res.json({ 
            result: 'success', 
            message: '수정 완료' 
        })
};

//댓글에 답글 삭제
const deleteReply = async (req, res, next) => {
        const { userId } = res.locals.user;
        const { replyId } = req.params;

        const targetReply = await ReplyService.getTargetReply({ replyId });
        if (targetReply.userId.toHexString() !== userId) {
            return res.status(401).json({
                result: 'false',
                message: '본인의 답글만 삭제할수있습니다',
            });
        }
        await ReplyService.deleteReply({ replyId });
        res.json({ 
            result: 'success', 
            message: '삭제 완료' 
        })
};

module.exports = {
    postReply,
    changeReply,
    deleteReply,
};

const ReplyService = require('../services/replies');

//댓글에 답글 작성
const postReply = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { content } = req.body;
        const { planId, commentId } = req.params;

        const Replies = await ReplyService.createReply({
            userId,
            content,
            planId,
            commentId,
        });

        return res.json({ result: 'success', message: '작성 완료' });
    } catch (error) {
        next(error);
    }
};

//댓글에 답글 수정
const changeReply = async (req, res, next) => {
    try {
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

        return res.json({ result: 'success', message: '수정 완료' });
    } catch (error) {
        next(error);
    }
};

//댓글에 답글 삭제
const deleteReply = async (req, res, next) => {
    try {
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
        res.json({ result: 'success', message: '삭제 완료' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    postReply,
    changeReply,
    deleteReply,
};

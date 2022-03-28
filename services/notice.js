const NoticeBoard = require('../models/noticeboard');
const NoticeMessage = require('../models/noticemessage');
const Plan = require('../models/plan');
const Comment = require('../models/comment');
const Reply = require('../models/reply');


const { NOTICE_EVENT: EVENT } = require('../config/constants');

const findAllNotice = async ({ user }) => {
    try {
        const findBoard = await NoticeBoard.findOne({
            userId: user.userId,
        }).populate({
            path: 'notices',
            populate: { path: 'sentUser', select: 'profile_img' },
        });
        await NoticeMessage.where({
            noticeBoardId: findBoard.noticeBoardId,
        }).updateMany({ checkNotice: 'true' });

        return findBoard.notices;
    } catch (error) {
        throw error;
    }
};

const createNewNoticeBoard = async ({ user }) => {
    try {
        const findExistBoard = await NoticeBoard.findOne({
            boardNum: user.snsId,
            userId: user.userId,
        });

        if (findExistBoard) return;
        else {
            const newBoard = new NoticeBoard({
                boardNum: user.snsId,
                userId: user.userId,
            });

            await newBoard.save();
            return;
        }
    } catch (error) {
        throw error;
    }
};

const createNewLikeNoticeMessage = async ({ sentUser, Id, type }) => {
    try {
        let text = '';
        if (type === 'plan') {
            text = EVENT.LIKE.PLAN;
            const findBoardOwner = await Plan.findOne({ _id: Id });

            if (sentUser.userId === findBoardOwner.userId.toHexString()) {
                return;
            }

            const findBoard = await NoticeBoard.findOne({
                userId: findBoardOwner.userId,
            });

            const newMessage = new NoticeMessage({
                noticeBoardId: findBoard.noticeBoardId,
                noticeType: 'Like',
                whereEvent: type,
                sentUser: sentUser.userId,
                planId: Id,
                noticeTitle: `${sentUser.nickname} ${text}`,
            });

            await newMessage.save();
            return;
        }

        if (type === 'comment') {
            text = EVENT.LIKE.COMMENT;

            const findBoardOwner = await Comment.findOne({ _id: Id });

            if (sentUser.userId === findBoardOwner.userId.toHexString()) {
                return;
            }

            const findBoard = await NoticeBoard.findOne({
                userId: findBoardOwner.userId,
            });

            const newMessage = new NoticeMessage({
                noticeBoardId: findBoard.noticeBoardId,
                noticeType: 'Like',
                whereEvent: type,
                sentUser: sentUser.userId,
                planId: findBoardOwner.planId,
                commentId: Id,
                noticeTitle: `${sentUser.nickname} ${text}`,
            });

            await newMessage.save();
            return;
        }
        if (type === 'reply') {
            text = EVENT.LIKE.REPLY;

            const findBoardOwner = await Reply.findOne({ _id: Id });

            if (sentUser.userId === findBoardOwner.userId.toHexString()) {
                return;
            }

            const findBoard = await NoticeBoard.findOne({
                userId: findBoardOwner.userId,
            });

            const newMessage = new NoticeMessage({
                noticeBoardId: findBoard.noticeBoardId,
                noticeType: 'Like',
                whereEvent: type,
                sentUser: sentUser.userId,
                planId: findBoardOwner.planId,
                replyId: Id,
                noticeTitle: `${sentUser.nickname} ${text}`,
            });

            await newMessage.save();
            return;
        }
    } catch (error) {
        throw error;
    }
};

const createNewCommentReplyNoticeMessage = async ({ sentUser, Id, type }) => {
    try {
        let text = '';
        let findBoardOwner = '';
        if (type === 'comment') {
            text = EVENT.COMMENT.PLAN;
            findBoardOwner = await Plan.findOne({ _id: Id });
            console.log(findBoardOwner.commentId);
        }
        if (type === 'reply') {
            text = EVENT.COMMENT.COMMENT;
            findBoardOwner = await Comment.findOne({ _id: Id });
        }

        if (sentUser.userId === findBoardOwner.userId.toHexString()) {
            return;
        }

        const findBoard = await NoticeBoard.findOne({
            userId: findBoardOwner.userId,
        });

        const newMessage = new NoticeMessage({
            noticeBoardId: findBoard.noticeBoardId,
            noticeType: 'CommentReply',
            whereEvent: type,
            sentUser: sentUser.userId,
            planId: findBoardOwner.planId,
            commentId: findBoardOwner.commentId,
            noticeTitle: `${sentUser.nickname} ${text}`,
        });

        await newMessage.save();
        return;
    } catch (error) {
        throw error;
    }
};

const createNewChatNoticeMessage = async ({ sentUser, document }) => {
    try {
        let text = EVENT.MESSAGE.CHAT;
        console.log(document);
        const findBoard = await NoticeBoard.findOne({
            userId: document.userId2,
        });

        const newMessage = new NoticeMessage({
            noticeBoardId: findBoard.noticeBoardId,
            noticeType: 'Chat',
            whereEvent: 'chat',
            sentUser: sentUser.userId,
            noticeTitle: `${sentUser.nickname} ${text}`,
        });

        await newMessage.save();
        return;
    } catch (error) {
        throw error;
    }
};

const deleteNotice = async ({ user, Id }) => {
    try {
        await NoticeMessage.deleteOne({
            _id: Id,
        });
        return;
    } catch (error) {
        throw error;
    }
};

const deleteAllNotice = async ({ user }) => {
    try {
        const findBoard = await NoticeBoard.findOne({
            userId: user.userId,
        });
        await NoticeMessage.deleteMany({
            noticeBoardId: findBoard.noticeBoardId,
        });
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createNewNoticeBoard,
    createNewLikeNoticeMessage,
    createNewCommentReplyNoticeMessage,
    createNewChatNoticeMessage,
    findAllNotice,
    deleteNotice,
    deleteAllNotice,
};

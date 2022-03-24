const NoticeBoard = require('../models/noticeboard');
const NoticeMessage = require('../models/noticemessage');
const Plan = require('../models/plan');
const Comment = require('../models/comment');

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

const createNewLikeNoticeMessage = async ({ sentUser, document, type }) => {
    try {
        let text = '';
        if (type === 'plan') text = EVENT.LIKE.PLAN;
        if (type === 'comment') text = EVENT.LIKE.COMMENT;
        if (type === 'reply') text = EVENT.LIKE.REPLY;

        const findBoardOwner = await Plan.findOne({ _id: document.planId });
        
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
            planId: document.planId,
            noticeTitle: `${sentUser.nickname} ${text}`,
        });

        await newMessage.save();
        return;
    } catch (error) {
        throw error;
    }
};

const createNewCommentReplyNoticeMessage = async ({
    sentUser,
    document,
    type,
}) => {
    try {
        let text = '';
        let findBoardOwner = '';
        if (type === 'comment') {
            text = EVENT.COMMENT.PLAN;
            findBoardOwner = await Plan.findOne({ _id: document.planId });
        }
        if (type === 'reply') {
            text = EVENT.COMMENT.COMMENT;
            findBoardOwner = await Comment.findOne({ _id: document.commentId });
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
            planId: document.planId,
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

const deleteNotice = async ({ user, id }) => {
    try {
        await NoticeMessage.deleteOneNotice({
            _id: id,
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

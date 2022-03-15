//스키마
const Like = require('../models/like');

//userId, planId, type으로 DB에 있는지 확인하기
const findLikeByUserIdAndIdAndType = async ({ userId, Id, type }) => {
    if (type === 'plan') {
        const findLike = await Like.findOne({ userId, planId: Id });
        return findLike;
    }
    if (type === 'comment') {
        const findLike = await Like.findOne({ userId, commentId: Id });
        return findLike;
    }
    if (type === 'reply') {
        const findLike = await Like.findOne({ userId, replyId: Id });
        return findLike;
    }
};

//userId와 planId로 Like콜렉션에 도큐먼트 생성하기
const createLike = async ({ userId, Id, type }) => {
    try {
        if (type === 'plan') {
            await Like.create({
                userId,
                planId: Id,
            });
            return;
        }
        if (type === 'comment') {
            await Like.create({
                userId,
                commentId: Id,
            });
            return;
        }
        if (type === 'reply') {
            await Like.create({
                userId,
                replyId: Id,
            });
            return;
        }
    } catch (error) {
        throw error;
    }
};

//userId와 planId로 Like콜렉션에서 도큐먼트 삭제하기
const deleteLike = async ({ userId, Id, type }) => {
    try {
        if (type === 'plan') {
            await Like.deleteOne({
                userId,
                planId: Id,
            });
            return;
        }
        if (type === 'comment') {
            await Like.deleteOne({
                userId,
                commentId: Id,
            });
            return;
        }
        if (type === 'reply') {
            await Like.deleteOne({
                userId,
                replyId: Id,
            });
            return;
        }
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findLikeByUserIdAndIdAndType,
    createLike,
    deleteLike,
};

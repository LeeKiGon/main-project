//스키마
const Bookmark = require('../models/bookmark');

//userId로 populate해서 북마크 된 plan 모두 가져오기
const getBookmarkByUserId = async ({ userId }) => {
    const getBookmarks = await Bookmark.find({ userId }).populate({
        path: 'planId',
        populate: { path: 'userId' },
    });

    return getBookmarks;
};

//userId와 planId로 DB에 있는지 확인하기
const findBookmarkByUserIdAndPlanId = async ({ userId, planId }) => {
    const findBookmark = await Bookmark.findOne({ userId, planId });

    if (findBookmark !== null) {
        return;
    }
    return findBookmark;
};

//userId와 planId로 북마크콜렉션에 도큐먼트 생성하기
const createBookmark = async ({ userId, planId }) => {
    try {
        await Bookmark.create({
            userId,
            planId,
        });
        return;
    } catch (error) {
        throw error;
    }
};

//userId와 planId로 북마크콜렉션에서 도큐먼트 삭제하기
const deleteBookmark = async ({ userId, planId }) => {
    try {
        await Bookmark.deleteOne({
            userId,
            planId,
        });
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getBookmarkByUserId,
    findBookmarkByUserIdAndPlanId,
    createBookmark,
    deleteBookmark
};

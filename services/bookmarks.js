const User = require('../models/user');
const Bookmark = require('../models/bookmark');

const getBookmarkByUserId = async ({ userId }) => {
    const findBookmarks = await Bookmark.find({ userId }).populate({
        path: 'planId',
        populate: { path: 'userId' },
    });

    return findBookmarks;
};

module.exports = {
    getBookmarkByUserId,
};

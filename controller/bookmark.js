const BookMarksService = require('../services/bookmarks');

const findBookmark = async (req, res) => {
    const { userId } = res.locals.user;

    const findBookmark = await BookMarksService.getBookmarkById({ userId });

    return res.json({ result: 'success', plans: findBookmark });
};

module.exports = {
    findBookmark,
};

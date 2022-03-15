const BookMarkService = require('../services/bookmark');

//북마크 불러오기
const findBookmark = async (req, res) => {
    const { userId } = res.locals.user;

    const getBookmark = await BookMarkService.getBookmarkByUserId({ userId });

    return res.json({ result: 'success', plans: getBookmark });
};

//북마크 추가
const addBookmark = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;

    const findBookmark = await BookMarkService.findBookmarkByUserIdAndPlanId({
        userId,
        planId,
    });
    console.log(findBookmark);

    if (findBookmark) {
        return res
            .status(401)
            .json({ result: 'fail', message: '이미 북마크 추가했습니다.' });
    }

    await BookMarkService.createBookmark({ userId, planId });
    res.json({
        result: 'success',
        message: '성공',
    });
};

//북마크 취소
const cancelBookmark = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;

    const findBookmark = await BookMarkService.findBookmarkByUserIdAndPlanId({
        userId,
        planId,
    });
    console.log(findBookmark);

    if (findBookmark) {
        return res
            .status(401)
            .json({ result: 'fail', message: '이미 북마크 취소했습니다.' });
    }

    await BookMarkService.deleteBookmark({ userId, planId });

        res.json({
            result: 'success',
            message: '성공',
        });
    }

module.exports = {
    findBookmark,
    addBookmark,
    cancelBookmark,
};

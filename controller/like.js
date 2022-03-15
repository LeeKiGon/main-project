const LikeService = require('../services/like');

//좋아요 추가
const addLike = async (req, res) => {
    const { userId } = res.locals.user;
    const { Id } = req.params;
    console.log(Id)
    let type = '';
    let num = req.originalUrl.split('/').length
    if (num === 5) type = 'plan';
    if (num === 6) type = 'comment';
    if (num === 7) type = 'reply';
    
    console.log(type) 

    const findLike = await LikeService.findLikeByUserIdAndIdAndType({
        userId,
        Id,
        type
    });
    console.log(findLike);
    
    if (!findLike) {
        return res
            .status(401)
            .json({ result: 'fail', message: '이미 좋아요 추가했습니다.' });
    }

    await LikeService.createLike({ userId, Id, type });
    res.json({
        result: 'success',
        message: '성공',
    });
  
};

//좋아요 취소
const cancelLike = async (req, res) => {
    const { userId } = res.locals.user;
    const { Id } = req.params;
    let type = req.url.split('/').length

    const findLike = await LikeService.findLikeByUserIdAndIdAndType({
        userId,
        Id,
        type
    });
    console.log(findLike);

    if (!findLike) {
        return res
            .status(401)
            .json({ result: 'fail', message: '이미 북마크 취소했습니다.' });
    }

    await LikeService.deleteLike({ userId, Id, type });
    res.json({
        result: 'success',
        message: '성공',
    });
}

module.exports = {
    addLike,
    cancelLike,
};

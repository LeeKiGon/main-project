const userService = require('../services/auth');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;

const updateUserInfo = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const { nickname } = req.body;
        const { location } = req.file;

        await userService.updateUserInfo({ userId, nickname, profile_img : location });
        res.status(200).json({
            result: 'success',
            message: '업데이트 완료되었습니다.',
        });
    } catch (error) {
        next(error);
    }
};

const getMyInfo = async (req, res, next) => {
    try {
        const { user } = res.locals;
        res.status(200).json({
            result: 'success',
            userId: user._id,
            snsId: user.snsId,
            email: user.email,
            nickname: user.nickname,
            userImg: user.profile_img,
        });
    } catch (error) {
        next(error);
    }
};

const getUserInfo = async (req, res, next) => {
    try {
        const { user } = res.locals;
        const { userId } = req.params;
        const findUserInfo = await userService.findUserInfoByUserId({
            myUserId: user.userId,
            otherUserId: userId,
        });
        res.status(200).json({ result: 'success', userInfo: findUserInfo });
    } catch (error) {
        next(error);
    }
};

const kakaoCallback = (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, (err, user) => {
        if (err) return next(err);
        const token = jwt.sign({ snsId: user.snsId }, JWT_SECRET_KEY);

        res.json({ token, userId: user.email });
    })(req, res, next);
};

module.exports = { kakaoCallback, getMyInfo, getUserInfo, updateUserInfo };

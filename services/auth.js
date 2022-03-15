const User = require('../models/user');

const updateUserInfo = async ({ userId, nickname, profile_img }) => {
    try {
        await User.findOneAndUpdate({ _id: userId }, { nickname, profile_img });
        return;
    } catch (error) {
        throw error;
    }
};

const findUserInfoByUserId = async ({ myUserId, otherUserId }) => {
    try {
        const loginUserInfo = await User.findOne({ _id: myUserId }).populate(
            'plans'
        );
        const otherUserInfo = await User.find({ _id: otherUserId }).populate({
            path: 'plans',
            match: { status: '공개' },
        });
        if (loginUserInfo.userId === otherUserInfo.userId) {
            return loginUserInfo;
        }
        return otherUserInfo;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findUserInfoByUserId,
    updateUserInfo,
};

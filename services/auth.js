const User = require('../models/user');
const deleteS3 = require('../utils/deleteS3');

const updateUserInfo = async ({ userId, nickname, profile_img }) => {
    try {
        const findUser = await User.findOne({ _id: userId });
        if (nickname) findUser.nickname = nickname;
        if (profile_img !== '') {
            if (!findUser.profile_img.includes('kakaocdn')) {
                deleteS3([findUser.profile_img]);
            }
            findUser.profile_img = profile_img;
        }

        await findUser.save();

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
        const otherUserInfo = await User.findOne({ _id: otherUserId }).populate(
            {
                path: 'plans',
                match: { status: '공개' },
            }
        );
        if (loginUserInfo.userId === otherUserInfo.userId) {
            return loginUserInfo;
        }
        return otherUserInfo;
    } catch (error) {
        throw error;
    }
};

const deleteUser = async ({ userId}) => {
    try {
        const findUser = await User.findOne({ _id: userId });
        if (!findUser.profile_img.includes('kakaocdn')) {
            deleteS3([findUser.profile_img]);
        }
        findUser.nickname = '(탈퇴한 계정)'
        findUser.snsId = ''

        return;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    findUserInfoByUserId,
    updateUserInfo,
    deleteUser
};

const User = require('../models/user');
const deleteS3 = require('../utils/deleteS3');
const bcrypt = require("bcrypt")
const uniqid = require('uniqid')

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

const createUser = async ({ nickname, password, email}) => {
    try {
        const encryptedPassword = bcrypt.hashSync(password, 10); // password 암호화
        const checkEmail = contact.match(/^([a-z0-9_\.-]+)@([\da-zA-Z\.-]+)\.([a-z\.]{2,6})$/);
        const checkNickName = /^[0-9a-zA-Zㄱ-ㅎ가-힣ㅏ-ㅣ]{2,10}$/; //영문 or 숫자 or 한글로 이루어진 ~10글자 닉네임 체크
        const checkPwd = /^(?=.*[0-9])(?=.*[a-zA-Z])[0-9a-zA-Z!@#$%^&*]{4,20}$/; //영문(필수), 숫자(필수), 특수문자(선택) 4~20글자 비밀번호 체크
        
        if (!checkEmail.test(email)) {
            return res.status(400).send({
                errorMessage: '가입 양식을 확인해주세요.',
            });
        }
        if (!checkNickName.test(nickname)) {
            return res.status(400).send({
                errorMessage: '가입 양식을 확인해주세요.',
            });
        }
        if (!checkPwd.test(password)) {
            return res.status(400).send({
                errorMessage: '가입 양식을 확인해주세요.',
            });
        }
        const newUser = new User({
            snsId: uniqid.time(),
            email,
            nickname,
            password: encryptedPassword,
            provider: 'Local'
        });
        await newUser.save();
        return newUser;
        
    } catch (error) {
        throw error;
    }
};

const getExistEmail = async ({ email }) => {
    try{
        const targetEmail = await User.find({ email })
        return targetEmail;
    } catch (error) {  
        throw err;
    }
};



// const deleteUser = async ({ userId}) => {
//     try {
//         const findUser = await User.findOne({ _id: userId });
//         if (!findUser.profile_img.includes('kakaocdn')) {
//             deleteS3([findUser.profile_img]);
//         }
//         findUser.nickname = '(탈퇴한 계정)'
//         findUser.snsId = ''

//         return;
//     } catch (error) {
//         throw error;
//     }
// }

module.exports = {
    findUserInfoByUserId,
    updateUserInfo,
    // deleteUser,
    createUser,
    getExistEmail,
};

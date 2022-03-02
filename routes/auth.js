const express = require('express');
const router = express.Router();
const passport = require('passport')
const User = require('../schemas/user')
const KakaoStrategy = require("passport-kakao").Strategy;
const {kakaokey} = process.env

passport.use('kakao', new KakaoStrategy({
    clientID: kakaokey,
    callbackURL: '/api/auth/kakao/callback',     // 위에서 설정한 Redirect URI
}, (accessToken, refreshToken, profile, done) => {
    // console.log(profile);
    console.log(accessToken);
    console.log(refreshToken);
    // authorization 에 성공했을때의 액션
    let user = {
        profile: profile._json,
        accessToken: accessToken
    }
    return done(null, user)
}
))

passport.serializeUser(function (user, done) {
    // console.log(`user : ${user.profile.id}`)
    done(null, user)
})
passport.deserializeUser(function (obj, done) {
    // console.log(`obj : ${obj}`)
    done(null, obj)
})





// passport.use('kakao', new KakaoStrategy({
//     clientID: kakaokey,
//     callbackURL: '/api/auth/kakao/callback',     // 위에서 설정한 Redirect URI
// }, async (accessToken, refreshToken, profile, done) => {
//     console.log(profile);
//     const existUser = await User.findOne({sns_id: profile.id, provider: profile.provider})

//         if(existUser) {
//             done(null, existUser)
//         } else {
//             const newUser = await User.create({
//                 sns_id: profile.id,
//                 email: profile.email,
//                 nickname:profile.nickname,
//                 profile_img: profile.thumbnail_image_url,
//                 provider: 'kakao',
//             })
//             done(null, newUser)
//         }

// }))




        // const existUser = await User.findOne({sns_id: profile.id, provider: profile.provider})

        // if(existUser) {
        //     done(null, existUser)
        // } else {
        //     const newUser = await User.create({
        //         sns_id: profile.id,
        //         email: profile.email,
        //         nickname:profile.nickname,
        //         profile_img: profile.thumbnail_image_url,
        //         provider: 'kakao',
        //     })
        //     done(null, newUser)
        // }

// }))


router.get('/auth/kakao', passport.authenticate('kakao'));

router.get('/auth/kakao/callback', passport.authenticate('kakao', { failureRedirect: '/',}),
(err, user) => {
//   console.log("리퀘스트", err)
//   console.log("ㅁㄴㅇㅁㄴㅇ", user)
});



module.exports = router;
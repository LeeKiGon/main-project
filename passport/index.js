const passport = require("passport");
const kakaoStrategy = require("passport-kakao").Strategy;
const User = require('../schemas/user')
const { kakaokey } = process.env

module.exports = () => {
    passport.use('kakao', new KakaoStrategy({
        clientID: kakaokey,
        callbackURL: '/api/auth/kakao/callback',     // 위에서 설정한 Redirect URI
      },
      
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        console.log(accessToken);
        console.log(refreshToken);
        // try {
        //     const existUser = await User.findOne({sns_id: profile.id, provider: profile.provider})

        //     if(existUser) {
        //         done(null, existUser)
        //     } else {
        //         const newUser = await User.create({
        //             sns_id: profile.id,
        //             email: profile.email,
        //             nickname:profile.nickname,
        //             profile_img: profile.thumbnail_image_url,
        //             provider: 'kakao',
        //         })
        //         done(null, newUser)
        //     }
        // }
    }))
    
}
const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const NoticeService = require('../services/notice')
const User = require('../models/user');

const { KAKAO_CLIENT_SECRET, KAKAO_CLIENT_ID, DOMAIN} = process.env;
const { STATIC_IMAGE : IMAGE } = require('../config/constants')

const callbackURL = (platform) => `${DOMAIN}/api/auth/${platform}/callback`

module.exports = (app) => {
    app.use(passport.initialize());
    passport.use(
        new kakaoStrategy(
            {
                clientID: KAKAO_CLIENT_ID,
                clientSecret: KAKAO_CLIENT_SECRET,
                callbackURL: callbackURL('kakao'), // 위에서 설정한 Redirect URI
            },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const findExistUser = await User.findOne({
                        snsId: profile.id,
                        provider: profile.provider,
                    });
                    if (findExistUser) {
                        await NoticeService.createNewNoticeBoard({ user : findExistUser })
                        done(null, findExistUser);
                    } else {
                        let profile_img = '';
                        !profile._json.properties.thumbnail_image 
                            ? profile_img = IMAGE.PROFILE_IMAGE 
                            : profile_img = profile._json.properties.thumbnail_image;
                        const newUser = await User.create({
                            email:
                                profile._json &&
                                profile._json.kakao_account.email,
                            nickname: profile.displayName,
                            snsId: profile.id,
                            profile_img,
                            provider: 'kakao',
                        });

                        await NoticeService.createNewNoticeBoard({ user : newUser })
                        done(null, newUser);
                    }
                } catch (error) {
                    console.error(error);
                    done(error);
                }
            }
        )
    );
};

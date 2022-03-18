const passport = require('passport');
const kakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

const { KAKAO_CLIENT_SECRET, KAKAO_CLIENT_ID, DOMAIN } = process.env;

const callbackURL = (platform) => `${DOMAIN}/api/auth/${platform}/callback`
console.log(callbackURL('kakao'))

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
                        done(null, findExistUser);
                    } else {
                        const newUser = await User.create({
                            email:
                                profile._json &&
                                profile._json.kakao_account.email,
                            nickname: profile.displayName,
                            snsId: profile.id,
                            profile_img:
                                profile._json.properties.thumbnail_image,
                            provider: 'kakao',
                        });
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

const passport = require("passport");
const router = express.Router();
const KakaoStrategy = require("passport-kakao").Strategy;
const User = require('../schemas/user')
const jwt = require('jsonwebtoken');
const { kakaokey, kakaoSecretkey, JWT_SECRET_KEY } = process.env;

module.exports = () => {
    passport.use(
        new KakaoStrategy(
            {
                clientID: kakaokey,
                clientSecret: kakaoSecretkey,
                callbackURL: 'http://localhost:3000/api/auth/kakao/callback', // 위에서 설정한 Redirect URI
            },
            async (accessToken, refreshToken, profile, done) => {
                console.log(profile);
                // console.log(accessToken);
                // console.log(refreshToken);
                try {
                    const exUser = await User.findOne({
                        snsId: profile.id,
                        provider: profile.provider,
                    });
                    if (exUser) {
                        done(null, exUser);
                    } else {
                        const newUser = await User.create({
                            email:
                                profile._json && profile._json.kakao_account.email,
                            nickname: profile.displayName,
                            snsId: profile.id,
                            profile_img: profile._json.properties.thumbnail_image,
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
    
}
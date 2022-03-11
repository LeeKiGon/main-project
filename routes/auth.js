const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../models/user');

const KakaoStrategy = require('passport-kakao').Strategy;
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/auth-middleware');

const { kakaokey, kakaoSecretkey, JWT_SECRET_KEY } = process.env;

// module.exports = () => {
passport.use(
    'kakao',
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
// };

// passport.serializeUser(function (user, done) {
//     // console.log(`user : ${user.profile.id}`)
//     done(null, user);
// });
// passport.deserializeUser(function (obj, done) {
//     // console.log(`obj : ${obj}`)
//     done(null, obj);
// });

router.get('/auth/kakao', passport.authenticate('kakao'));

// router.get(
//     '/auth/kakao/callback',
//     passport.authenticate('kakao', { failureRedirect: '/' }),
//     (req, res) => {
//         console.log(req.user);
//         const token = jwt.sign({ snsId: req.user.snsId }, JWT_SECRET_KEY);

//         // res.redirect('http://localhost:3000');
//         // res.json(token);
//         // console.log(token, header)
//         res.render('http://localhost:3000', {token})
//     }
// );

router.get('/auth/kakao/callback', (req, res, next) => {
    passport.authenticate('kakao', { failureRedirect: '/' }, (err, user) => {
        if (err) return next(err);
        const token = jwt.sign({ snsId: user.snsId }, JWT_SECRET_KEY);

        // res.redirect('http://localhost:3000');
        // res.json(token);
        // console.log(token, header)
        res.json({ token, userId: user.email });
    })(req, res, next);
});

// const kakaoCallback = (req, res, next) => {/
//     passport.authenticate(
//       "kakao",
//       { failureRedirect: "/" },
//       (err, user, info) => {
//         if (err) return next(err);
//         const { userId, nick } = user;
//         const token = jwt.sign({ userId, nick }, process.env.SECRET_KEY);
//         result = {
//           token,
//           nick,
//         };
//         res.send({ user: result });
//       }
//     )(req, res, next);
//   };

//나의 정보 보기
router.get('/users/auth/me', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    res.json({
        userId: user._id,
        snsId: user.snsId,
        email: user.email,
        nickname: user.nickname,
        userImg: user.profile_img,
    });
});

// 유저 프로필 조회
router.get('/users/:userId', authMiddleware, async (req, res) => {
    const { user } = res.locals;
    const { userId } = req.params;

    const loginUser = await User.findOne({ snsId: user.snsId }).populate('plans');
    const findUser = await User.findOne({ _id: userId }).populate({path: 'plans', match : {status:'공개'}});

    if (loginUser.userId === findUser.userId) {
        return res.json({ result: 'success', userInfo: loginUser })
    } else {
        return res.json({ result: 'success', userInfo: findUser });
    }
});

module.exports = router;

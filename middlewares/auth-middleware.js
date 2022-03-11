const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { JWT_SECRET_KEY } = process.env

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    const [authType, authToken] = (authorization || '').split(' ')
    // console.log(req.url, req.method, authorization, 'Token',authToken,'Type', authType);
    if(req.method === 'GET' && (!authToken || authType !== 'Bearer')) {
        next();
        return
    } else {
        if (!authToken || authType !== 'Bearer') {
            return res.status(401).send({
                errorMessage: '로그인 후 이용 가능한 기능입니다.',
            })
        }
    }
    try {
        const { snsId } = jwt.verify(authToken, JWT_SECRET_KEY)
        User.findOne({ snsId }).then((user) => {
            res.locals.user = user
            next()
        })
    } catch (err) {
        res.status(401).send({
            errorMessage: '로그인 후 이용 가능한 기능입니다.',
        })
    }
}
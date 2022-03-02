require('dotenv').config();
const express = require('express');
const connect = require('./schemas');
const cors = require('cors');

const app = express();
const router = express.Router();
const testRouter = require('./routes/test')
const authRouter = require('./routes/auth')
const { swaggerUi, specs } = require('./models/swagger');

connect();

app.use((req, res, next) => {
    console.log(
        'Request URL:',
        `[${req.method}]`,
        req.originalUrl,
        ' - ',
        new Date().toLocaleString()
    )
    next()
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(express.urlencoded({extended: false}), router); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser
app.use('/api', [testRouter, authRouter])


const corsOptions = {
    origin: '*',
    // credentials: true
};

app.use(cors(corsOptions));

app.listen(3000, () => {
    console.log( new Date().toLocaleString() , '서버가 3000포트로 요청을 받을 준비가 됐어요');
});
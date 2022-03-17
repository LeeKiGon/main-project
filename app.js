require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
// const fs = require('fs');
// const https = require('https');
const cors = require('cors');
const app = express();
const routes = require('./routes/index.js')
const passportConfig = require("./passport");
// const { swaggerUi, specs } = require('./utils/swagger');
const { LETSENCRYPT } = process.env;

// const option = {
//     ca: fs.readFileSync(`${LETSENCRYPT}fullchain.pem`),
//     key: fs.readFileSync(`${LETSENCRYPT}privkey.pem`),
//     cert: fs.readFileSync(`${LETSENCRYPT}cert.pem`)
//   };

app.use((req, res, next) => {
    console.log(
        'Request URL:',
        `[${req.method}]`,
        req.originalUrl,
        ' - ',
        new Date().toLocaleString(),
    )
    next()
})
// console.log(new Date())

const corsOptions = {
    origin: '*',
    // credentials: true
};

// app.use(helmet.hidePoweredBy()); //req header x-powerd-by 변경
// app.use(helmet.xssFilter()); //xss cross site script 공격 방어
// app.use(helmet.noSniff()); //유형에서 벗어난 응답에 대한 MIME 가로채기를 방지
// app.use(helmet.frameguard({ action: "deny" })); //iframe 클릭재킹
// app.use(helmet.ieNoOpen()); //internet explorer 버전에서 신뢰할 수 없는 html을 다운못하게함
// app.use(helmet.hsts()) // 이후 요청이 https로만 와야 허락
// app.use(helmet.dnsPrefetchControl()) //브라우저의 dns레코드 미리추출방지
app.use(cors(corsOptions));
app.use(helmet());
passportConfig(app)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(express.urlencoded({extended: false})); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser
app.use('/api', routes)



module.exports = app;
require('dotenv').config();
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./routes/index.js')
const passportConfig = require("./passport");
// const { swaggerUi, specs } = require('./utils/swagger');


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
console.log(new Date())

const corsOptions = {
    origin: '*',
    // credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
passportConfig(app)
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(express.json());
app.use(express.urlencoded({extended: false})); // API 요청에서 받은 body 값을 파싱(해석)하는 역할을 수행하는 것이 bodyParser
app.use('/api', routes)



module.exports = app;
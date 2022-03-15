const app = require("./app");
const connect = require("./models");


const { PORT } = process.env;

connect();

server = app.listen(PORT, () => {
    console.log( new Date().toLocaleString() , `서버가 ${PORT}포트로 요청을 받을 준비가 됐어요`);
});

require("./config/socket").init(server);
require("./utils/socketHandler");
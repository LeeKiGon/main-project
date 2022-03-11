const app = require("./app");
const connect = require("./models");


// const { SERVER_PORT, SERVER_DOMAIN } = process.env;

connect();

server = app.listen(3000, () => {
    console.log( new Date().toLocaleString() , '서버가 3000포트로 요청을 받을 준비가 됐어요');
});

// socket connection
require("./config/socket").init(server);
require("./utils/socketHandler");
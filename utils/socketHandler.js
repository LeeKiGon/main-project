const chatService = require('../services/chat');
// const userService = require("../services/auth");

const io = require('../config/socket').getIo();

// const { SOCKET_EVENT: EVENT, DIRECTORY } = require("../config/constants");

io.on('connection', (socket) => {
    console.log(`User : ${socket.id}`);
    socket.on('disconnect', () => {
        clearInterval(socket.interval);
    });

    // socket error
    socket.on('error', (error) => {
        console.error(error);
    });

    //소켓 로그인
    socket.on('login', ({ fromSnsId }) => {
        console.log(fromSnsId, '로 로그인 되었습니다')
        socket.join(fromSnsId);
    });

    // roomNum Maker
    const roomNumMaker = (x, y) => {
        const arr = [x, y];
        arr.sort((a, b) => a - b);
        let roomNum = arr[0].toString() + arr[1];
        console.log(roomNum)
        return roomNum;
    };

    // socket room join
    socket.on('joinRoom', async ({ fromSnsId, toSnsId }) => {
        try {
            const roomNum = await roomNumMaker(fromSnsId, toSnsId);
            await chatService.findAndUpdateChatRoom({
                fromSnsId,
                toSnsId,
                roomNum,
            });
            socket.join(roomNum);
            io.to(roomNum).emit('join', toSnsId);
            socket.leave(fromSnsId);
        } catch (error) {
            console.log(error);
        }
    });

    // socket room leave
    socket.on('leaveRoom', async ({ fromSnsId, toSnsId }) => {
        try {
            const roomNum = await roomNumMaker(fromSnsId, toSnsId);
            socket.leave(roomNum);
        } catch (error) {
            console.log(error);
        }
    });

    // socket room (chat)
    socket.on('room', async ({ fromSnsId, toSnsId, chatText, createdAt }) => {
        try {
            const roomNum = await roomNumMaker(fromSnsId, toSnsId);

            let checkChat = false;
            if (io.sockets.adapter.rooms.get(roomNum).size === 2) {
                checkChat = true;
            }

            const chatMessage = {
                toSnsId,
                fromSnsId,
                chatText,
                checkChat,
                createdAt,
            };

            await chatService.saveChatMessage({
                roomNum,
                ...chatMessage,
            });
            // 보내는 사람 프로필 사진/ 정보 찾아서 넣어주기
            // sendUserId = await userService.getUserByUserId({
            //     userId: toSnsId,
            // });
            // getChat.fromSnsId = fromSnsId;
            io.to(roomNum).emit('chat', chatMessage);
            io.to(toSnsId).emit('list', chatMessage);
        } catch (error) {
            console.log(error);
        }
    });



});


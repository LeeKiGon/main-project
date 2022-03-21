const chatService = require('../services/chat');
// const { randomFilename } = require("../middleware/uploader");
// const { convertAndSaveS3 } = require("../utils/converter");

// const { S3_HOST } = process.env;
// const { DIRECTORY } = require("../config/constants");

const roomNumMaker = (x, y) => {
    const arr = [x, y];
    arr.sort((a, b) => a - b);
    let roomNum = arr[0].toString() + arr[1].toString();
    return roomNum;
};

const getChatMessageByIds = async (req, res) => {
        const { snsId } = res.locals.user;
        const { page } = req.query;
        const { toSnsId } = req.params; //상대방꺼 userId임

        const roomNum = await roomNumMaker(snsId, toSnsId);
        const getChat = await chatService.getChatMessageByRoomNum({
            fromSnsId: snsId,
            toSnsId,
            roomNum,
            page,
            // chatCount,
        });
        console.log(snsId, toSnsId)
        await chatService.findAndUpdateChatRoom({ fromSnsId: snsId , toSnsId, roomNum });
        return res
            .status(200)
            .json({ result: 'success', chatMessages: getChat });
};

const getChatListByUserId = async (req, res) => {
        const { userId } = res.locals.user;
        const findChatRoom = await chatService.getChatRoomList({ userId });
        return res
            .status(200)
            .json({ result: 'success', chatRoomList: findChatRoom });
};

const checkNewChat = async (req, res) => {
        const { userId } = res.locals.user;
        const newChatMessage = await chatService.checkChat({ userId });
        res.status(200).json({ result: 'success', newChatMessage });
};


// 채팅방 삭제
const deletechatroom = async (req, res) => {
    const { userId } = res.locals.user
    const { chatroomId } = req.params

    const targetchatroom = await chatService.getTargetchatroom({ chatroomId })
    // if (targetchatroom.userId.toHexString() !== userId) {
    //     return res
    //         .status(200)
    //         .json({ result: 'false' , message: "본인의 채팅방만 삭제할수있습니다"});
    // }
    await chatService.getOutChatRoom({ chatroomId, userId });
    res.json({
        result: 'success',
        message: "성공"
    });
}


// 이미지 파일(보류)
// const postImage = async (req, res, next) => {
//     const { sendUserId, receiveUserId } = req.body;
//     const { location } = req.file;
//     const chatText = location;
//     const checkChat = false;
//     const chatType = DIRECTORY.IMAGE;
//     const sample = null;
//     const roomNum = await roomNumMaker(sendUserId, receiveUserId);

//     await chatService.createChat({
//       roomNum,
//       sendUserId,
//       receiveUserId,
//       chatText,
//       checkChat,
//       chatType,
//       sample,
//     });
//     res.sendStatus(200);
// };

module.exports = { getChatListByUserId, getChatMessageByIds, checkNewChat, deletechatroom };

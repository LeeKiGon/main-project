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

const getChatMessageByIds = async (req, res, next) => {
    try {
        const { snsId } = res.locals.user;
        const { page } = req.query;
        const { toSnsId } = req.params; //상대방꺼 userId임

        console.log(snsId, toSnsId);

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
    } catch (error) {
        next(error);
    }
};

const getChatListByUserId = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const findChatRoom = await chatService.getChatRoomList({ userId });
        return res
            .status(200)
            .json({ result: 'success', chatRoomList: findChatRoom });
    } catch (error) {
        next(error);
    }
};

const checkNewChat = async (req, res, next) => {
    try {
        const { userId } = res.locals.user;
        const newChatMessage = await chatService.checkChat({ userId });
        res.status(200).json({ result: 'success', newChatMessage });
    } catch (error) {
        next(error);
    }
};

// 이미지 파일(보류)
// const postImage = async (req, res, next) => {
//   try {
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
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = { getChatListByUserId, getChatMessageByIds, checkNewChat };

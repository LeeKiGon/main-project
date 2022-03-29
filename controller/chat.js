const ChatService = require('../services/chat');
// const { randomFilename } = require("../middleware/uploader");
// const { convertAndSaveS3 } = require("../utils/converter");

// const { S3_HOST } = process.env;
// const { DIRECTORY } = require("../config/constants");
const NoticeService = require('../services/notice')

const roomNumMaker = (x, y) => {
    const arr = [x, y];
    arr.sort((a, b) => a - b);
    let roomNum = arr[0].toString() + arr[1].toString();
    return roomNum;
};

const getChatMessageByIds = async (req, res) => {
        const { user } = res.locals;
        const { snsId } = res.locals.user;
        const { page } = req.query;
        const { toSnsId } = req.params; //상대방꺼 userId임

        const roomNum = await roomNumMaker(snsId, toSnsId);
        const getChat = await ChatService.getChatMessageByRoomNum({
            fromSnsId: user.snsId,
            toSnsId,
            roomNum,
            page,
            // chatCount,
        });
        const checkFirst = await ChatService.findAndUpdateChatRoom({ fromSnsId: user.snsId , toSnsId, roomNum });
        if(checkFirst) await NoticeService.createNewChatNoticeMessage({sentUser: user, document: checkFirst})
        return res
            .status(200)
            .json({ result: 'success', ChatMessages: getChat });
};

const getChatListByUserId = async (req, res) => {
        const { userId } = res.locals.user;
        const findChatRoom = await ChatService.getChatRoomList({ userId });
        return res
            .status(200)
            .json({ result: 'success', ChatRoomList: findChatRoom });
};

// 채팅방 삭제
const deletechatroom = async (req, res) => {
    const { userId } = res.locals.user
    const { chatRoomId } = req.params

    await ChatService.getOutChatRoom({ chatRoomId, userId });
    res.json({
        result: 'success',
        message: "성공"
    });
}

module.exports = { getChatListByUserId, getChatMessageByIds, deletechatroom };

const ChatRoom = require('../models/chatroom');
const ChatMessage = require('../models/chatmessage');
const User = require('../models/user');

const findAndUpdateChatRoom = async ({ fromSnsId, toSnsId, roomNum }) => {
    try {
        if (!fromSnsId || !toSnsId || !roomNum) {
            //   throw customizedError(MESSAGE.WRONG_REQ, 400);
            throw new Error('잘못된 요청입니다.');
        }

        const findChatRoom = await ChatRoom.findOne({ roomNum });
        const findUser = await User.findOne({ snsId: fromSnsId });
        const findUser2 = await User.findOne({ snsId: toSnsId });

        // 기존 채팅 방이 없으면 생성 후 리턴
        if (!findChatRoom) {
            const newRoom = new ChatRoom({
                userId: findUser.userId,
                userId2: findUser2.userId,
                roomNum,
            });
            await newRoom.save()
            return newRoom;
        }
        // 기존 채팅 방이 있으면 해당 채팅방의 checkChat 전부 true로 업데이트 후 리턴
        await ChatMessage.where({
            chatRoomId: findChatRoom.chatRoomId,
            fromUserId: findUser2,
        }).updateMany({ checkChat: 'true' });

        return false;
    } catch (error) {
        throw error;
    }
};

// 채팅 내용 저장 api
const saveChatMessage = async ({
    toSnsId,
    fromSnsId,
    chatText,
    checkChat,
    roomNum,
    createdAt,
}) => {
    try {
        const findChatRoom = await ChatRoom.findOne({ roomNum });
        if (!findChatRoom) {
            //  throw customizedError(MESSAGE.ISNOT_CHATROOM, 400);
            throw new Error('잘못');
        }

        const findUser = await User.findOne({ snsId: fromSnsId });
        const findUser2 = await User.findOne({ snsId: toSnsId });

        const creatChat = await ChatMessage.create({
            fromUserId: findUser.userId,
            toUserId: findUser2.userId,
            chatText,
            checkChat,
            chatRoomId: findChatRoom.chatRoomId,
            createdAt,
        });

        findChatRoom.lastChat = creatChat.chatMessageId;
        if (findChatRoom.outUser !== '') findChatRoom.outUser = '';
        await findChatRoom.save();
        return;
    } catch (error) {
        throw error;
    }
};

// 채팅방 입장 시 채팅 내용 불러오기 api
// 페이지 별로 프론트에서 정해진 갯수만큼 리턴하게 구성
const getChatMessageByRoomNum = async ({
    fromSnsId,
    toSnsId,
    roomNum,
    page,
}) => {
    try {
        if (page <= 0 || !page) {
            page = 1;
        }

        const myProfile = await User.findOne({ snsId: fromSnsId }); // 유저 정보
        const yourProfile = await User.findOne({ snsId: toSnsId }); // 유저 정보 2

        if (!myProfile || !yourProfile) {
            // throw customyourProfiledError(MESSAGE.NOT_USER, 400);
            throw new Error('잘못된 요청입니다.');
        }
        const findChatRoom = await ChatRoom.findOne({ roomNum });
        if (findChatRoom.outUser === myProfile.userId) {
            findChatRoom.outUser = '';
            await findChatRoom.save();
        }

        if (findChatRoom) {
            const findChatMessages = await ChatMessage.find({
                $and: [
                    { chatRoomId: findChatRoom.chatRoomId },
                    { outUser: { $ne: myProfile.userId } },
                ],
            })
                .sort('createdAt')
                // .skip(20 * (page - 1))
                // .limit(20)
                .populate('fromUserId toUserId');

            // 채팅을 누가 읽느냐에 따라서 리턴값이 달라짐.
            // 프론트 쪽에서 원하는 형식에 맞게 구성해서 리턴(프론트요청)
            for (let i = 0; i < findChatMessages.length; i++) {
                if (myProfile.userId === findChatMessages[i].fromUserId) {
                    findChatMessages[i]._doc.fromUserId = myProfile;
                    findChatMessages[i]._doc.toUserId = yourProfile.userId;
                } else if (
                    yourProfile.userId === findChatMessages[i].fromUserId
                ) {
                    findChatMessages[i]._doc.fromUserId = yourProfile;
                    findChatMessages[i]._doc.toUserId = myProfile.userId;
                }
            }
            return findChatMessages;
        }
        return;
    } catch (error) {
        throw error;
    }
};

//나간사람 : 재정Id

// 채팅방 리스트 페이지 들어갔을 때 리스트 불러오기 api
const getChatRoomList = async ({ userId }) => {
    try {
        //userId가 속해 있는 채팅방을 찾아내고 연결되어있는 lastChat과 from,to를 가져온다.
        const findChatRoomList = await ChatRoom.find({
            $and: [
                {
                    $or: [{ userId }, { userId2: userId }],
                },
                {
                    outUser: { $ne: userId },
                },
            ],
        }).populate({
            path: 'lastChat userId userId2',
        });

        if (!findChatRoomList) {
            return;
        }
        // 채팅방 목록 불러온 사람이 무조건 userId 가 되게 변경
        for (let i = 0; i < findChatRoomList.length; i++) {
            const myUserInfo = findChatRoomList[i].userId;
            const notReadCount = await ChatMessage.count({
                chatRoomId: findChatRoomList[i].chatRoomId,
                toUserId: userId,
                checkChat: false,
            });
            if (findChatRoomList[i].userId2.userId === userId) {
                findChatRoomList[i]._doc.userId = findChatRoomList[i].userId2;
                findChatRoomList[i]._doc.userId2 = myUserInfo;
            }
            findChatRoomList[i]._doc.notReadCount = notReadCount;
        }

        return findChatRoomList;
    } catch (error) {
        throw error;
    }
};

// 채팅을 읽었는지 확인하는 api
const checkChat = async ({ userId }) => {
    try {
        const test = await User.findOne({ _id: userId }).populate('chatRooms');

        const findChatRoomList = await ChatRoom.find({
            $or: [{ userId }, { userId2: userId }],
        }).populate({
            path: 'lastChat',
            populate: { path: 'fromUserId toUserId' },
        });

        let newChatMessage = false;
        if (!findChatRoomList) {
            return newChatMessage;
        }

        for (let i = 0; i < findChatRoomList.length; i++) {
            let lastChat = findChatRoomList[i].lastChat;
            if (findChatRoomList[i].lastChat) {
                if (
                    lastChat.checkChat === false &&
                    lastChat.fromUserId.userId !== userId
                )
                    return (newChatMessage = true);
            }
        }
        return newChatMessage;
    } catch (error) {
        throw error;
    }
};

const getOutChatRoom = async ({ chatRoomId, userId }) => {
    const findChatRoom = await ChatRoom.findOne({ _id: chatRoomId });
    if (findChatRoom.outUser === '') {
        findChatRoom.outUser = userId;
        await findChatRoom.save();
        const findChatMessages = await ChatMessage.find({ chatRoomId });
        for (let message of findChatMessages) {
            if (message.outUser !== '') {
                await ChatMessage.deleteOne({ _id: message._id });
            } else {
                message.outUser = userId;
                await message.save();
            }
        }
        return;
    } else {
        await ChatRoom.deleteOne({ _id: chatRoomId });
        return;
    }
};

module.exports = {
    findAndUpdateChatRoom,
    saveChatMessage,
    getChatMessageByRoomNum,
    getChatRoomList,
    checkChat,
    getOutChatRoom,
};

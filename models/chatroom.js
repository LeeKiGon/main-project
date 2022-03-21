const mongoose = require("mongoose");
const ChatMessage = require('../models/chatmessage')

const ChatRoomSchema = new mongoose.Schema({
    roomNum: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userId2 :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    lastChat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatMessage',
    },
    outUser: {
        type: String,
        default: ''
    }
},
{timestamps: true});

ChatRoomSchema.virtual('chatRoomId').get(function () {
    return this._id.toHexString();
});

ChatRoomSchema.pre(
    'deleteOne',
    { document: false, query: true },
    async function (next) {
        // chatromm id
        const { _id } = this.getFilter();
        // chatmessage 전부 삭제
        await ChatMessage.deleteMany({ chatRoomId: _id });
        next();
    }
);

ChatRoomSchema.set('toJSON', { virtuals: true });
ChatRoomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
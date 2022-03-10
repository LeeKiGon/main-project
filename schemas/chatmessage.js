const mongoose = require("mongoose");

const ChatmessageSchema = new mongoose.Schema({
    chatRoomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    userId2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    chatText: {
        type: String,
    },
    checkChat: {
        type: Boolean,
    },
},{timestamps: true});

module.exports = mongoose.model('Chatmessage', ChatmessageSchema);
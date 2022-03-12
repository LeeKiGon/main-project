const mongoose = require("mongoose");

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
},
{timestamps: true});

ChatRoomSchema.virtual('chatRoomId').get(function () {
    return this._id.toHexString();
});


module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
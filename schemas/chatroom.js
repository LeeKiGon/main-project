const mongoose = require("mongoose");

const ChatroomSchema = new mongoose.Schema({
    roomNumber: {
        type: Number,
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
        type: String,
    },
},
{timestamps: true});


module.exports = mongoose.model('Chatroom', ChatroomSchema);
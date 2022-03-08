const mongoose = require("mongoose");

const ChatmessageSchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
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
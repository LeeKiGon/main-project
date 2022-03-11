const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
    },    
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Like', LikeSchema);
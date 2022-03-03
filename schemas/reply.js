const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content:{
        type: String
    },
},
{ timestamps: true });

ReplySchema.virtual('replyId').get(function () {
    return this._id.toHexString();
});

ReplySchema.set('toJSON', { virtuals: true });
ReplySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reply', ReplySchema);
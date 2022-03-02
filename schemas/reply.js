const mongoose = require("mongoose");

const ReplySchema = new mongoose.Schema({
    comment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content:{
        type: String
    },
});

ReplySchema.virtual('reply_id').get(function () {
    return this._id.toHexString();
});

ReplySchema.set('toJSON', { virtuals: true });
ReplySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Reply', ReplySchema);
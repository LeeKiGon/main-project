const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
    travel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content:{
        type: String
    },
},
{ timestamps: true });

CommentSchema.virtual('comment_id').get(function () {
    return this._id.toHexString();
});

CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', CommentSchema);
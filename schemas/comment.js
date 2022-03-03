const mongoose = require("mongoose");
const Reply = require('../schemas/reply');

const CommentSchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
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

CommentSchema.virtual('commentId').get(function () {
    return this._id.toHexString();
});

CommentSchema.virtual('replies',{
    ref: 'Reply',
    localField: '_id',
    foreignField: 'Commentid',
})

CommentSchema.pre(
    'deleteOne',
    { document: false, query: true },
    async function (next) {
        // comment id
        const { _id } = this.getFilter();
        // reply 전부 삭제
        await Reply.deleteMany({ commentId: _id });
        next();
    }
);

CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Comment', CommentSchema);
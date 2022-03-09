const mongoose = require("mongoose");
const Reply = require('../schemas/reply');
const Like = require('../schemas/like')

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
    foreignField: 'commentId',
})

CommentSchema.virtual('likeCount', {
    localField: '_id',
    ref: 'Like',
    foreignField: 'commentId',
    count: true,
});

CommentSchema.statics.findLike = async function (foundComment , user) {
    if(user === undefined){
        for (let i = 0; i < foundComment.length; i++) {
            foundComment[i]._doc.isLike = false;
        }
        return foundComment;
    }

    for (let i = 0; i < foundComment.length; i++) {
        const LikeUser = await Like.findOne({ userId : user.userId, commentId : foundComment[i].commentId})
        LikeUser ? foundComment[i]._doc.isLike = true : foundComment[i]._doc.isLike = false;
        if(foundComment[i].replies.length > 0) {
            for(let j=0; j< foundComment[i].replies.length; j++){
                const replyLikeUser = await Like.findOne({ userId : user.userId, replyId : foundComment[i].replies[j].replyId})
                replyLikeUser ? foundComment[i].replies[j]._doc.isLike = true : foundComment[i].replies[j]._doc.isLike = false;
            }
        }
    };
    return foundComment;
};


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
const mongoose = require("mongoose");

const NoticeMessageSchema = new mongoose.Schema({
    noticeBoardId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'NoticeBoard',
    },
    // 회원님의 what을 event했습니다.
    noticeType: {
        type: String,
    }, // [BroadCast , Like, commentReply, Chat]
    whereEvent: {
        type: String,
    },//plan에서 발생한지, comment에서 발생했는지 ...
    sentUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    }, // 여행 좋아요 일때, 댓글일때
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    },
    replyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reply',
    },
    checkNotice: {
        type: Boolean,
        default: false,
    },
    noticeTitle: {
        type: String,
    },//타입이 공지일때만
    noticeContent: {
        type: String,
    },//타입이 공지일때만 
    noticeImage : {
        type : String,
    }//타입이 공지일때만 
},
{timestamps: true});

NoticeMessageSchema.virtual('noticeMessageId').get(function () {
    return this._id.toHexString();
});

NoticeMessageSchema.set('toJSON', { virtuals: true });
NoticeMessageSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NoticeMessage', NoticeMessageSchema);
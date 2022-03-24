const mongoose = require("mongoose");
const NoticeMessage = require('../models/noticemessage')

const NoticeBoardSchema = new mongoose.Schema({
    boardNum: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
},
{timestamps: true});

NoticeBoardSchema.virtual('noticeBoardId').get(function () {
    return this._id.toHexString();
});

NoticeBoardSchema.virtual('notices', {
    ref: 'NoticeMessage',
    localField: '_id',
    foreignField: 'noticeBoardId',
})

NoticeBoardSchema.pre(
    'deleteOne',
    { document: false, query: true },
    async function (next) {
        // noticeBoard Id
        const { _id } = this.getFilter();
        // NoticeMessage 전부 삭제
        await NoticeMessage.deleteMany({ noticeBoardId: _id });
        next();
    }
);

NoticeBoardSchema.set('toJSON', { virtuals: true });
NoticeBoardSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('NoticeBoard', NoticeBoardSchema);
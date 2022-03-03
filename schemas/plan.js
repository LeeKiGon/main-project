const mongoose = require('mongoose');
const Plan = require('../schemas/plan');
const Reply = require('../schemas/reply');
const Like = require('../schemas/like');
const Bookmark = require('../schemas/bookmark');
const Place = require('../schemas/place');
const Day = require('../schemas/day');
const Comment = require('../schemas/comment');


const PlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // foreignFields: '_id',
    },
    title: {
        type: String
    },
    location:{
        type: String
    },
    nickname: {
        type: String,
    },
    startDate: {
        type: String,
    },
    endDate: {
        type: String,
    },
    category: {
        type: Object,
    },
},
{timestamps:true});

PlanSchema.virtual('planId').get(function () {
    return this._id.toHexString();
});

PlanSchema.virtual('days', {
    ref: 'Day',
    localField: '_id',
    foreignField: 'planId',
});

PlanSchema.statics.findIsLike = async function (page , user) {
    const before = await this.find().sort('-createdAt').skip(5 * (page - 1)).limit(5).populate('userId', 'snsId email nickname profile_img').exec();
    for(let i = 0; i < before.length; i++){
        before[i]._doc.userId.snsId === user.snsId ? before[i]._doc.isLike = true : before[i]._doc.isLike = false
    }
    console.log(before[0].userId.snsId);
    console.log(user.snsId)
    return before;
}

PlanSchema.pre(
    'deleteOne',
    { document: false, query: true },
    async function (next) {
        // post id
        const { _id } = this.getFilter();
        // 자식 전부 삭제
        await Day.deleteMany({ planId: _id });
        await Place.deleteMany({ planId: _id });
        await Like.deleteMany({ planId: _id });
        await Bookmark.deleteMany({ planId: _id });
        await Comment.deleteMany({ planId: _id });
        await Reply.deleteMany({ planId: _id });
        next();
    }
);

PlanSchema.set('toJSON', { virtuals: true });
PlanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Plan', PlanSchema);

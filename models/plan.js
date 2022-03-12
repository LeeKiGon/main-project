const mongoose = require('mongoose');
const User = require('../models/user');
const Reply = require('../models/reply');
const Like = require('../models/like');
const Bookmark = require('../models/bookmark');
const Place = require('../models/place');
const Day = require('../models/day');
const Comment = require('../models/comment');

const PlanSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // foreignFields: '_id',
    },
    title: {
        type: String
    },
    destination: {
        type: String
    },
    locations: {
        type: Array
    },
    withlist: {
        type: Array
    },
    style: {
        type: Array
    },
    status: {
        type: String,
        default: '비공개'
    },
    nickname: {
        type: String
    },
    thumbnailImage: {
        type: String
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
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

PlanSchema.virtual('bookmarkCount', {
    ref: 'Bookmark',
    localField: '_id',
    foreignField: 'planId',
    count: true,
});

PlanSchema.virtual('likeCount', {
    ref: 'Like',
    localField: '_id',
    foreignField: 'planId',
    count:true,
});

PlanSchema.statics.findLikeBookmark = async function (foundPlan , user) {
    // const findPaging = await this.find().sort('-createdAt').skip(5 * (page - 1)).limit(5).populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img').exec();
    // console.log(this)
    // console.log(user)
    if(user === undefined){
        for (let i = 0; i < foundPlan.length; i++) {
        foundPlan[i]._doc.isLike = false;
        foundPlan[i]._doc.isBookmark = false;
        }
        return foundPlan;
    }

    for (let i = 0; i < foundPlan.length; i++) {
        const LikeUser = await Like.findOne({ userId : user.userId, planId: foundPlan[i].planId })
        // console.log("likeUser :", LikeUser)
        const BookMarkUser = await Bookmark.findOne({ userId : user.userId, planId: foundPlan[i].planId })
        // console.log("BookMarkUser :", BookMarkUser)
        LikeUser ? foundPlan[i]._doc.isLike = true : foundPlan[i]._doc.isLike = false
        BookMarkUser ? foundPlan[i]._doc.isBookmark = true : foundPlan[i]._doc.isBookmark = false
    };
    return foundPlan;
};

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

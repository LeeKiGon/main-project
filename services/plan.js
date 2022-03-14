const User = require('../models/user');
const Plan = require('../models/plan');
const Day = require('../models/day');

const findOnePlanByPlanId = async ({ planId }) => {
    const findPlan = await Plan.findOne({ _id: planId });
    return findPlan;
};
const findAllPlanByUserId = async ({ userId }) => {
    const findPlan = await Plan.find({ userId });
    return findPlan;
};

const findAllPublicPlans = async ({ page, user, destination, style }) => {
    page === undefined || page < 0 ? (page = 1) : +page;
    destination === undefined
        ? (destination = ['국내', '해외'])
        : (destination = [destination]);

    if (typeof style === 'string') {
        style = [style];
    }
    console.log('스타일 :', style);
    if (style === undefined) {
        const numPlans = await Plan.count({
            destination: { $in: destination },
            status: '공개',
        });
        const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
        const findPage = await Plan.find({
            destination: { $in: destination },
            status: '공개',
        })
            .sort('-createdAt')
            .skip(5 * (page - 1))
            .limit(5)
            .populate(
                'userId likeCount bookmarkCount',
                'snsId email nickname profile_img'
            );

        const plansLikeBookmark = await Plan.findLikeBookmark(findPage, user);
        return { plans: plansLikeBookmark, endPage };
    } else {
        const numPlans = await Plan.count({
            destination: { $in: destination },
            style: { $all: style },
            status: '공개',
        });
        const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
        const findByStyle = await Plan.find({
            destination: { $in: destination },
            style: { $all: style },
            status: '공개',
        })
            .sort('-createdAt')
            .skip(5 * (page - 1))
            .limit(5)
            .populate(
                'userId likeCount bookmarkCount',
                'snsId email nickname profile_img'
            );

        const plansLikeBookmark = await Plan.findLikeBookmark(
            findByStyle,
            user
        );
        return { plans: plansLikeBookmark, endPage };
    }
};

const createPlan = async ({
    user,
    title,
    startDate,
    endDate,
    destination,
    style,
    withlist,
}) => {
    const newPlan = new Plan({
        userId: user.userId,
        nickname: user.nickname,
        title,
        startDate,
        endDate,
        destination,
        style,
        withlist,
    });

    // 여행일정 day 계산 후 저장
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);

    const diffDate = sDate.getTime() - eDate.getTime();
    const dateDays = Math.abs(diffDate / (1000 * 3600 * 24));

    await newPlan.save();

    for (let i = 1; i <= dateDays + 1; i++) {
        const newDay = await Day.create({
            planId: newPlan._id,
            dayNumber: i,
        });
    }
    return newPlan;
};

const findOnePlanByPlanIdisLikeBookMark = async ({ user, planId }) => {
    const plan = await Plan.findOne({ _id: planId })
        .populate({
            path: 'days',
            populate: { path: 'places' },
        })
        .populate('userId likeCount bookmarkCount');

    const planLikeBookmark = await Plan.findLikeBookmark([plan], user);

    return planLikeBookmark[0];
};

const changePlanByPlanId = async ({ findPlan, status }) => {
    findPlan.status = status;

    await findPlan.save();
    return;
};

const deletePlanByPlanId = async ({ planId }) => {
    await Plan.deleteOne({ _id: planId });
    return;
};

const addThumbnail = async ({ thumbnailImage, planId }) => {
    try {
        await Plan.updateOne({ _id: planId }, { $set: { thumbnailImage } });
        return;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    findAllPublicPlans,
    createPlan,
    findOnePlanByPlanIdisLikeBookMark,
    changePlanByPlanId,
    deletePlanByPlanId,
    findOnePlanByPlanId,
    findAllPlanByUserId,
    addThumbnail,
};

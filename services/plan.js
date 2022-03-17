const User = require('../models/user');
const Plan = require('../models/plan');
const Place = require('../models/place');
const Day = require('../models/day');
const deleteS3 = require('../utils/deleteS3');

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

const calculateDays = (start, end) => {
    let sDate = new Date(start);
    let eDate = new Date(end);
    let diffDate = sDate.getTime() - eDate.getTime();
    return Math.abs(diffDate / (1000 * 3600 * 24));
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

    await newPlan.save();

    for (let i = 1; i <= calculateDays(startDate, endDate) + 1; i++) {
        const newDay = await Day.create({
            planId: newPlan._id,
            dayNumber: i,
        });
    }
    return newPlan;
};

const updatePlan = async ({
    planId,
    title,
    startDate,
    endDate,
    destination,
    style,
    withlist,
}) => {
    const findPlan = await Plan.findOne({ _id: planId });
    let beforeDays = calculateDays(findPlan.startDate, findPlan.endDate);
    let updateDays = calculateDays(startDate, endDate);
    let diffDays = Math.abs(beforeDays - updateDays);
    if (beforeDays < updateDays) {
        for (let i = beforeDays + 2; i <= beforeDays + diffDays + 1; i++) {
            const newDay = await Day.create({
                planId: findPlan._id,
                dayNumber: i,
            });
        }
    }
    if (beforDays > updateDays) {
        await Day.deleteMany(
            { planId },
            { $gt: { dayNumber: updateDays + 1 } }
        );
    }

    findPlan.title = title;
    findPlan.startDate = startDate;
    findPlan.endDate = endDate;
    findPlan.destination = destination;
    findPlan.style = style;
    findPlan.withlist = withlist;

    await findPlan.save();

    return findPlan;
};

const findOnePlanByPlanIdisLikeBookMark = async ({ user, planId }) => {
    const plan = await Plan.findOne({ _id: planId })
        .populate({
            path: 'days',
            populate: { path: 'places' },
        })
        .populate('userId likeCount bookmarkCount');

    const planLikeBookmark = await Plan.findLikeBookmark([plan], user);

    const findPlaces = await Place.find({ planId });
    let allImages = [];
    for (let place of findPlaces) {
        for (let image of place.memoImage) {
            allImages.push(image);
        }
    }

    planLikeBookmark[0]._doc.allImages = allImages;

    return planLikeBookmark[0];
};

const changePlanByPlanId = async ({ findPlan, status }) => {
    findPlan.status = status;

    await findPlan.save();
    return;
};
const deletePlanByPlanId = async ({ planId }) => {
    const findPlaces = await Place.find({ planId });
    let S3DeleteList = [];
    for (let place of findPlaces) {
        for (let image of place.memoImage) {
            S3DeleteList.push(image);
        }
    }
    deleteS3(S3DeleteList);
    await Plan.deleteOne({ _id: planId });
    return;
};

const addThumbnail = async ({ thumbnailImage, planId }) => {
    try {
        const findPlan = await Plan.findOne({ _id: planId });
        if (findPlan.thumbnailImage) deleteS3([findPlan.thumbnailImage]);
        console.log('테스트');
        findPlan.thumbnailImage = thumbnailImage;
        await findPlan.save();
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
    updatePlan,
};

const Plan = require('../models/plan');

const getSearch = async ({ page, query, style, user }) => {
    page === undefined || page < 0 ? (page = 1) : +page;
    if (style === undefined) {
        const numPlans = await Plan.count({
            $or: [
                { title: { $regex: query } },
                { locations: { $regex: query } },
            ],
            status: '공개',
        });
        console.log(numPlans);
        const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
        const findPage = await Plan.find({
            $or: [
                { title: { $regex: query } },
                { locations: { $regex: query } },
            ],
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
    }

    const numPlans = await Plan.count({
        style: { $all: style },
        status: '공개',
        $or: [{ title: { $regex: query } }, { locations: { $regex: query } }],
    });

    console.log(numPlans);
    const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
    const findByStyle = await Plan.find({
        $or: [{ title: { $regex: query } }, { locations: { $regex: query } }],
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

    const plansLikeBookmark = await Plan.findLikeBookmark(findByStyle, user);

    return { plans: plansLikeBookmark, endPage };
};

module.exports = {
    getSearch,
};

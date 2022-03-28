const planService = require('../services/plan');

const getAllPlans = async (req, res) => {
    const { user } = res.locals;
    let { page, destination, style, sort } = req.query;

    const findAllPublicPlans = await planService.findAllPublicPlans({
        page,
        user,
        destination,
        style,
        sort,
    });

    return res.json(findAllPublicPlans);
};

const getMostLikedPlans = async (req, res) => {
    const findPlans = await planService.findLikePlanByDate();

    return res.json({
        result: 'success',
        message: '성공',
        plans: findPlans,
    });
};

const getMostBookMarkedPlans = async (req, res) => {
    const findPlans = await planService.findBookMarkPlanByDate();

    return res.json({
        result: 'success',
        message: '성공',
        plans: findPlans,
    });
};

const addNewPlan = async (req, res) => {
    const { user } = res.locals;
    const { title, startDate, endDate, destination, style, withlist } =
        req.body;

    const newPlan = await planService.createPlan({
        user,
        title,
        startDate,
        endDate,
        destination,
        style,
        withlist,
    });
    res.json({
        result: 'success',
        message: '성공',
        planId: newPlan.planId,
    });
};

const getPlanByPlanId = async (req, res) => {
    const { user } = res.locals;
    const { planId } = req.params;

    const findPlan = await planService.findOnePlanByPlanIdisLikeBookMark({
        user,
        planId,
    });

    res.json({
        result: 'success',
        message: '성공',
        plan: findPlan,
    });
};

const changePlanStatus = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;
    const { status } = req.body;

    const findPlan = await planService.findOnePlanByPlanId({ planId });
    if (findPlan.userId.toHexString() !== userId) {
        return res.status(401).json({
            result: 'fail',
            message: '본인의 여행만 변경할수 있습니다.',
        });
    }
    await planService.changePlanByPlanId({ findPlan, status });

    return res
        .status(200)
        .json({ result: 'success', message: '변경 완료 되었습니다.' });
};

const deletePlan = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;

    const findPlan = await planService.findOnePlanByPlanId({ planId });
    if (findPlan.userId.toHexString() !== userId) {
        return res.status(401).json({
            result: 'fail',
            message: '본인의 여행만 변경할수 있습니다.',
        });
    } else {
        await planService.deletePlanByPlanId({ planId });
        res.json({
            result: 'success',
            message: '삭제 완료',
        });
    }
};

const getMyPlans = async (req, res) => {
    const { userId } = res.locals.user;

    const findplans = await planService.findAllPlanByUserId({ userId });

    res.json({ plans: findplans });
};

const addNewThumbnail = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;
    const { location } = req.file;

    const findPlan = await planService.findOnePlanByPlanId({ planId });
    if (findPlan.userId.toHexString() !== userId) {
        return res.status(401).json({
            result: 'fail',
            message: '본인의 여행만 변경할수 있습니다.',
        });
    }
    await planService.addThumbnail({ thumbnailImage: location, planId });

    return res
        .status(200)
        .json({ result: 'success', message: '변경 완료 되었습니다.' });
};

const updatePlanInfo = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;
    const { title, startDate, endDate, destination, style, withlist } =
        req.body;

    const findPlan = await planService.findOnePlanByPlanId({ planId });
    if (findPlan.userId.toHexString() !== userId) {
        return res.status(401).json({
            result: 'fail',
            message: '본인의 여행만 변경할수 있습니다.',
        });
    }
    await planService.updatePlan({
        planId,
        title,
        startDate,
        endDate,
        destination,
        style,
        withlist,
    });

    return res
        .status(200)
        .json({ result: 'success', message: '변경 완료 되었습니다.' });
};

const copyPlan = async (req, res) => {
    const { user } = res.locals;
    const { planId } = req.params;

    const copyPlan = await planService.copyPlanByPlanId({ planId, user });

    // const io = require('../config/socket').getIo();
    // io.to('21428643792142969908').emit('new', copyPlan);
    return res.status(200).json({
        result: 'success',
        message: '복사 완료 되었습니다.',
        planId: copyPlan.planId,
    });
};

const searchPlan = async (req, res) => {
    const { user } = res.locals;
    let { page, query, style, destination, sort } = req.query;

    const Search = await planService.getSearch({ page, query, destination, style, user, sort });

    return res.json(Search);
};

module.exports = {
    getAllPlans,
    addNewPlan,
    getPlanByPlanId,
    changePlanStatus,
    deletePlan,
    getMyPlans,
    addNewThumbnail,
    updatePlanInfo,
    copyPlan,
    getMostLikedPlans,
    getMostBookMarkedPlans,
    searchPlan,
};

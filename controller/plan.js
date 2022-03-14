const planService = require('../services/plan');

const getAllPlans = async (req, res) => {
    const { user } = res.locals;
    let { page , destination, style } = req.query;

    const findAllPublicPlans = await planService.findAllPublicPlans({ page, user, destination, style })

    return res.json(findAllPublicPlans);
}

const addNewPlan = async (req, res) => {
    const { user } = res.locals;
    const { title, startDate, endDate, destination, style, withlist } = req.body;
    
    const newPlan = await planService.createPlan({ user, title, startDate, endDate, destination, style, withlist })
    res.json({
        result: 'success',
        message: "성공", 
        planId: newPlan.planId });
}

const getPlanByPlanId = async (req, res) => {
    const { user } = res.locals
    const { planId } = req.params;
    
    const findPlan = await planService.findOnePlanByPlanIdisLikeBookMark({user, planId})

    res.json({ 
        result: 'success',
        message: "성공", 
        plan : findPlan
    });
}

const changePlanStatus = async (req, res) => {
    const { userId } = res.locals.user;
    const { planId } = req.params;
    const { status } = req.body;

    const findPlan = await planService.findOnePlanByPlanId({ planId })
    if(findPlan.userId.toHexString() !== userId) {
        return res.status(401).json({ result: 'fail', message: '본인의 여행만 변경할수 있습니다.' });
    }
    await planService.changePlanByPlanId(findPlan, status);
    

    return res.status(200).json({ result : 'success', message: '변경 완료 되었습니다.' })
}

const deletePlan = async (req, res) => {
    const { uesrId } = res.locals.user;
    const { planId }  = req.params;

    const findPlan = await planService.findOnePlanByPlanId({ planId })
    if(findPlan.userId.toHexString() !== userId) {
        return res.status(401).json({ result: 'fail', message: '본인의 여행만 변경할수 있습니다.' });
    } else {

        await planService.deletePlanByPlanId({planId});
        res.json({
            result: 'success',
            message: "삭제 완료"
        });
    }
}

const getMyPlans = async (req, res) => {
    const { userId } = res.locals.user;

    const findplans = await planService.findAllPlanByUserId({ userId });

    res.json({ plans : findplans });
}

module.exports = {
    getAllPlans,
    addNewPlan,
    getPlanByPlanId,
    changePlanStatus,
    deletePlan,
    getMyPlans,
}
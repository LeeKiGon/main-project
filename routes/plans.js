const express = require('express');
const router = express.Router();
const planController = require('../controller/plan')

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');


const { ROUTE } = require("../config/constants");


// 전체 여행 불러오기
router.get(ROUTE.PLAN.GET_ALL, authMiddleware, planController.getAllPlans)
// 여행 생성하기
router.post(ROUTE.PLAN.ADD, authMiddleware, planController.addNewPlan)
// 특정여행 불러오기
router.get(ROUTE.PLAN.GET, authMiddleware, planController.getPlanByPlanId)
// 공개 / 비공개 설정
router.post(ROUTE.PLAN.CHANGE_STATUS, authMiddleware, planController.changePlanStatus)
// 특정 여행 삭제
router.delete(ROUTE.PLAN.DELETE, authMiddleware, planController.deletePlan)
// 나의 여행 불러오기
router.get(ROUTE.PLAN.GET_MY, authMiddleware, planController.getMyPlans)

// router.get('/plans', authMiddleware, async (req, res) => {
//     const { user } = res.locals;
//     let { page , destination, style } = req.query;

//     page === undefined || page < 0 ? page = 1 : +page;
//     destination === undefined ? destination = ['국내','해외'] : destination = [destination];

//     if(typeof style === 'string') {
//         style = [style];
//     }
//     console.log("스타일 :",style);

//     //카테고리 아무것도 선택 안했을 때
//     if(style === undefined) {
//         const numPlans = await Plan.count({detination : {$all : destination},status : '공개'})
//         console.log(numPlans)
//         const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5);
//         const findPage = await Plan.find({detination : {$all : destination}, status:'공개'}).sort('-createdAt').skip(5 * (page - 1)).limit(5).populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img')

//         const plansLikeBookmark = await Plan.findLikeBookmark(findPage, user);

//         return res.json({ plans: plansLikeBookmark, endPage });
//     } 
    
//     //카테고리 선택했을 때
//     const numPlans = await Plan.count({destination: {$all : destination}, style : {$all : style}, status : '공개'})
//     const endPage = numPlans === 0 ? 1 : Math.ceil(numPlans / 5)
//     const findByStyle = await Plan.find({style : {$all : style}, status : '공개'}).sort('-createdAt').skip(5 * (page - 1)).limit(5).populate('userId likeCount bookmarkCount', 'snsId email nickname profile_img')
    
//     const plansLikeBookmark = await Plan.findLikeBookmark(findByStyle, user);
    
//     return res.json({ plans: plansLikeBookmark, endPage });
// });


// /* 여행 후기,작성 페이지 */
// // 여행 생성하기
// router.post('/plans', authMiddleware, async (req, res) => {
//     const { userId, nickname } = res.locals.user;
//     const { title, startDate, endDate, destination, style, withlist } = req.body;
//     const newPlan = new Plan({
//         userId,
//         nickname,
//         title,
//         startDate,
//         endDate,
//         destination,
//         style,
//         withlist
//     });

//     // 여행일정 day 계산 후 저장
//     const sDate = new Date(startDate);
//     const eDate = new Date(endDate); 

//     const diffDate = sDate.getTime() - eDate.getTime();
//     const dateDays = Math.abs(diffDate / (1000 * 3600 * 24));
//     console.log('dateDays', dateDays);
//     await newPlan.save();

//     for (let i = 1; i <= dateDays + 1; i++) {
//         const newDay = await Day.create({
//             planId: newPlan._id,
//             dayNumber: i,
//         });
//         console.log(`day${i} 생성 완료`);
//     }

//     res.json({
//         result: 'success',
//         message: "성공", 
//         planId: newPlan.planId });
// });

// //특정 여행 불러오기
// router.get('/plans/:planId', authMiddleware, async (req, res) => {
//     const { user } = res.locals
//     const { planId } = req.params;
//     const plan = await Plan.findOne({_id : planId }).populate({
//         path: 'days',
//         populate: { path: 'places' },
//     }).populate('userId likeCount bookmarkCount');

//     const planLikeBookmark = await Plan.findLikeBookmark([plan], user)

//     res.json({ 
//         result: 'success',
//         message: "성공", 
//         plan : planLikeBookmark[0]
//     });
// });

// // 공개 or 비공개 컨트롤하기
// router.post('/plans/:planId/public', authMiddleware, async (req, res) => {
//     const { userId } = res.locals.user;
//     const { planId } = req.params;
//     const { status } = req.body;

//     const findPlan = await Plan.findOne({ _id: planId })
//     if(findPlan.userId.toHexString() !== userId) {
//         return res.status(401).json({ result: 'fail', message: '본인의 여행만 변경할수 있습니다.' });
//     }

//     findPlan.status = status;
//     await findPlan.save();

//     return res.status(200).json({ result : 'success', message: '변경 완료 되었습니다.' })
// });

// //여행 삭제하기
// router.delete('/plans/:planId', authMiddleware, async (req, res) => {
//     const { nickname } = res.locals.user;
//     const { planId }  = req.params;

//     const targetPlan = await Plan.findOne({ _id: planId, nickname });
//     if (!targetPlan) {
//         return res.json({ result: 'false' });
//     } else {
//         await Plan.deleteOne({ _id : planId });
//         res.json({
//             result: 'success',
//             message: "삭제 완료"
//         });
//     }
// });

/* 나의 여행 페이지 */
// 나의 여행 불러오기
// router.get('/myplans', authMiddleware, async (req, res) => {
//     const { userId } = res.locals.user;

//     const findplans = await Plan.find({ userId });

//     res.json({ plans : findplans });
// });

module.exports = router;
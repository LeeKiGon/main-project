const express = require('express');
const router = express.Router();
const ReplyController = require('../controller/replies');
//스키마
const Reply = require('../models/reply');

//미들웨어
const authMiddleware = require('../middlewares/auth-middleware');
const { ROUTE } = require('../config/constants');

//답글 생성
router.post(ROUTE.REPLIES.ADD, authMiddleware, ReplyController.postReply);
// router.post('/plans/comments/:commentId/reply', authMiddleware, async (req, res) => {
//     const { userId } = res.locals.user;
//     const { content } = req.body;
//     const { planId, commentId } = req.params;

//     const newReply = await Reply.create({
//         userId,
//         commentId,
//         content,
//         planId
//     });

//     res.json({
//         result: 'success',
//         message: '성공',
//     });

// });

//답글 수정
router.patch(ROUTE.REPLIES.UPDATE, authMiddleware, ReplyController.changeReply);
// router.patch(ROUTE.REPLIES.UPDATE, authMiddleware, async (req, res) => {
//     const { userId } = res.locals.user;
//     const { replyId } = req.params;
//     const { content } = req.body;

//     const targetReply = await Reply.findOne({ _id: replyId });
//     if (targetReply.userId.toHexString() !== userId) {
//         return res.status(401).json({
//             result: 'false',
//             message: '본인의 댓글만 수정할수있습니다',
//         });
//     }
//     await Reply.updateOne({ _id: replyId }, { $set: { content } });
//     res.json({
//         result: 'success',
//         message: '성공',
//     });
// });

//여행 댓글에 답글 삭제
router.delete(ROUTE.REPLIES.DELETE, authMiddleware, ReplyController.deleteReply);
// router.delete('/plans/comments/replies/:replyId', authMiddleware, async (req, res) => {
//         const { userId } = res.locals.user;
//         const { replyId } = req.params;

//         const targetReply = await Reply.findOne({ _id: replyId });
//         if (targetReply.userId.toHexString() !== userId) {
//             return res.json({
//                 result: 'false',
//                 message: '본인의 댓글만 삭제할수있습니다',
//             });
//         } else {
//             await Reply.deleteOne({ _id: replyId });
//             res.json({
//                 result: 'success',
//                 message: '성공',
//             });
//         }
//     }
// );

module.exports = router;

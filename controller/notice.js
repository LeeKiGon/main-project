const NoticeService = require('../services/notice');

const getAllNotice = async (req, res) => {
    const { user } = res.locals;

    if (user === undefined) {
        return res
            .status(401)
            .json({
                result: 'fail',
                message: '로그인 후 이용 가능한 기능입니다.',
            });
    }

    const findNotices = await NoticeService.findAllNotice({ user });

    res.json({
        result: 'success',
        message: '성공',
        notices: findNotices,
    });
};

const deleteOneNotice = async (req, res) => {
    const { noticeMessageId } = req.params;

    await NoticeService.deleteNotice({ id: noticeMessageId });

    res.json({
        result: 'success',
        message: '삭제 완료되었습니다.',
    });
};

const deleteAllNotice = async (req, res) => {
    const { user } = res.locals;

    await NoticeService.deleteAllNotice({ user });

    res.json({
        result: 'success',
        message: '삭제 완료되었습니다.',
    });
};

module.exports = {
    getAllNotice,
    deleteOneNotice,
    deleteAllNotice,
};

const MESSAGE = {
    NOT_CONNECT_SOCKET_IO: 'socket.io is not initalized',
};

const SOCKET_CORS = {
    origin: '*',
    methods: ['GET', 'POST'],
};

const DIRECTORY = {
    PLAN: {
        destination: ['국내', '해외'],
        style: [
            '액티비티 체험',
            '문화 예술 역사 체험',
            '명소 관광지 방문 필수',
            '페스티벌 참여',
            '먹방 투어',
            '쇼핑 좋아',
            '편하게 쉬는 휴양',
            'SNS 핫플 투어',
            '호캉스',
            '자연 친화',
        ],
    },
};

const NOTICE_EVENT = {
    LIKE : {
        PLAN : '님이 회원님의 여행✈에 쪼아요❤️를 눌렀어요.',
        COMMENT: '님이 회원님의 댓글💌에 쪼아요❤️를 눌렀어요.',
        REPLY : '님이 회원님의 답글🎀에 쪼아요❤️를 눌렀어요.'
    },
    COMMENT : {
        PLAN : '님이 회원님의 여행✈에 댓글을 남겼어요.',
        COMMENT: '님이 회원님의 댓글🤩에 답글을 남겼어요.',
    },
    MESSAGE : {
        CHAT : '님이 대화💬를 요청했어요! 채팅방을 확인해주세요.'
    }
};

const ROUTE = {
    INDEX: '/',
    BOOKMARK: {
        FIND: '/plans/bookmark',
        BOOKMARKPLAN: '/plans/:planId/bookmark',
    },
    LIKE: {
        LIKEPLAN: '/plans/:Id/like',
        LIKECOMMENT: '/plans/comments/:Id/like',
        LIKEREPLY: '/plans/comments/replies/:Id/like',
    },
    COMMENT: {
        FIND: '/plans/:planId/comments',
        WRITE: '/plans/:planId/comments',
        UPDATE: '/plans/:planId/:commentId',
        DELETE: '/plans/:planId/:commentId',
    },
    SEARCH: {
        SEARCH: '/plans/search',
    },
    REPLIES: {
        ADD: '/plans/comments/:commentId/reply',
        UPDATE: '/plans/comments/replies/:replyId',
        DELETE: '/plans/comments/replies/:replyId',
    },
    PLAN: {
        GET_ALL: '/plans',
        ADD: '/plans',
        GET: '/plans/:planId',
        CHANGE_STATUS: '/plans/:planId/public',
        DELETE: '/plans/:planId',
        GET_MY: '/myplans',
        ADD_THUMBNAIL: '/plans/:planId/thumbnail',
        UPDATE: '/plans/:planId',
        COPY: '/plans/:planId/copy',
        GET_HOT_LIKE: '/plans/hotlike',
        GET_HOT_BOOKMARK: '/plans/hotBookmark',
        GET_HOT_DOMESTIC: '/plans/hotDomestic',
        GET_HOT_INTERNATINAL: '/plans/hotInternational',
    },
    AUTH: {
        KAKAO: '/auth/kakao',
        KAKAO_CALLBACK: '/auth/kakao/callback',
        GET_MY_INFOMATION: '/users/auth/me',
        GET_USERS_INFOMATION: '/users/:userId',
        UPDATE_MY_INFOMATION: '/users/auth/me',
        WITHDRAW: '/users/auth/me',
    },
    PLACES: {
        ADD: '/plans/days/:dayId',
        UPDATE: '/plans/days/places/:placeId',
        DELETE: '/plans/days/places/:placeId',
        IMAGE_DELETE: '/plans/days/places/:placeId/:imageIndex',
    },
    CHAT: {
        GET_MY_CHATROOMLIST: '/chat/list',
        GET_MY_NEWCHAT: '/chat/new',
        GET_MY_CHATMESSAGE: '/chat/:toSnsId',
        DELETE: '/chat/:chatRoomId',
    },
    NOTICE: {
        GET_MY : '/notice',
        DELETE_NOTICE : '/notice/:noticeMessageId',
        DELETE_ALL_NOTICE : '/notice'
    }
};

module.exports = {
    SOCKET_CORS,
    MESSAGE,
    ROUTE,
    DIRECTORY,
    NOTICE_EVENT
};

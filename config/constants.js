const MESSAGE = {
    NOT_CONNECT_SOCKET_IO: 'socket.io is not initalized',
};

const SOCKET_CORS = {
    origin: '*',
    methods: ['GET', 'POST'],
};

const STATIC_IMAGE = {
    PROFILE_IMAGE : "https://triplan-project.s3.ap-northeast-2.amazonaws.com/images/1648708819064cb4t4ef0l1emnuk8.jpeg"
}

const DIRECTORY = {
    PLAN: {
        destination: ['국내', '해외'],
        style: [
            '액티비티 체험',
            '문화 예술 역사 체험',
            '명소 관광지 방문필수',
            '페스티벌 참여',
            '먹방투어',
            '쇼핑 좋아',
            '편하게 쉬는 휴양',
            'SNS 핫플 투어',
            '호캉스',
            '자연친화',
        ],
    },
};

const NOTICE_EVENT = {
    LIKE : {
        PLAN : '님이 회원님의 여행을 좋아합니다.',
        COMMENT: '님이 회원님의 댓글을 좋아합니다.',
        REPLY : '님이 회원님의 답글을 좋아합니다.'
    },
    COMMENT : {
        PLAN : '님이 회원님의 여행에 댓글을 남겼습니다.',
        COMMENT: '님이 회원님의 댓글에 답글을 남겼습니다.',
    },
    MESSAGE : {
        CHAT : '님이 메세지를 보냈습니다.'
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
        SEARCH: '/plans/search',
    },
    AUTH: {
        KAKAO: '/auth/kakao',
        KAKAO_CALLBACK: '/auth/kakao/callback',
        GET_MY_INFOMATION: '/users/auth/me',
        GET_USERS_INFOMATION: '/users/:userId',
        UPDATE_MY_INFOMATION: '/users/auth/me',
        WITHDRAW: '/users/auth/me',
        CHECK_EMAIL : '/users/email',
        SIGN_UP : '/users',
        SIGN_IN : '/users/auth'
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
        DELETE : '/notice/:noticeMessageId',
        DELETE_ALL : '/notice',
        GET_NEW : '/notice/new'
    }
};

module.exports = {
    SOCKET_CORS,
    MESSAGE,
    ROUTE,
    DIRECTORY,
    NOTICE_EVENT,
    STATIC_IMAGE
};

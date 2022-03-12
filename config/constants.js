const MESSAGE = {
    NOT_CONNECT_SOCKET_IO: 'socket.io is not initalized',
};

const SOCKET_CORS = {
    origin: '*',
    methods: ['GET', 'POST'],
};

const DIRECTORY = {
    CATEGORY_URL: 'categoryUrl',
    CHAT_IMAGES: 'chatImages',
    CHAT_TRACKS: 'chatTracks',
    ETC: 'etc',
    IMAGES: 'images',
    TRACKS: 'tracks',
    TRACK_THUMBNAIL: 'trackThumbnail',
    UNTRACKS: 'untracks',
    AUDIO: 'audio',
    IPHONE: 'iphone',
    IMAGE: 'image',
    CATEGORYALL: '전체',
    CATEGORYALLTEXT: '최근에 올라온 목소리',
    CHAT_TYPE: 'text',
    TIMEOUT: '10s',
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
        DELETE: '/plans/:planId/:commentId'
    },
    SEARCH: {
        SEATCH: '/plans/search',
    },
    REPLIES: {
        ADD: '/plans/comments/:commentId/reply',
        UPDATE: '/plans/comments/replies/:replyId',
        DELETE: '/plans/comments/replies/:replyId'
    },
    PLAN:{
        GET_ALL: '/plans',
        ADD: '/plans',
        GET: '/plans/:planId',
        CHANGE_STATUS: '/plans/:planId/public',
        DELETE: '/plans/:planId',
        GET_MY: '/myplans',
    },
    AUTH: {
        KAKAO : '/auth/kakao',
        KAKAO_CALLBACK: '/auth/kakao/callback',
        GET_MY_INFOMATION: '/users/auth/me',
        GET_USERS_INFOMATION: '/users/:userId',
        UPDATE_MY_INFOMATION: '/users/auth/me'
    },
    PLACES: {
        ADD: '/plans/days/:dayId',
        UPDATE: '/plans/days/places/:placeId',
        DELETE: '/plans/days/places/:placeId',
    }
};

module.exports = {
    SOCKET_CORS,
    MESSAGE,
    DIRECTORY,
    ROUTE,
};

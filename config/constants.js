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
        FIND : '/plans/bookmark'
    },
};

module.exports = {
    SOCKET_CORS,
    MESSAGE,
    DIRECTORY,
    ROUTE,
};

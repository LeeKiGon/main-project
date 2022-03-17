const path = require('path');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const uniqid = require('uniqid')

// .env
const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, BUCKET_NAME } = process.env;

const S3 = new AWS.S3({
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
    region: S3_REGION,
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLocaleLowerCase();
    if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg' && ext !== '.jfif' && ext !== '.gif')
        cb({ message: '이미지 파일 형식이 맞지 않습니다.' }, false);
    else cb(null, true);
};
    

const storage = multerS3({
    s3: S3,
    bucket: BUCKET_NAME,
    key(req, file, cb) {
        cb(null, `images/${Date.now()}${uniqid()}${path.extname(file.originalname).toLocaleLowerCase()}`); 
    },
});

exports.upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter,
});

const AWS = require('aws-sdk');
const { S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION, BUCKET_NAME } = process.env;

module.exports = (place, uri) => {
    const S3 = new AWS.S3({
        accessKeyId: S3_ACCESS_KEY_ID,
        secretAccessKey: S3_SECRET_ACCESS_KEY,
        region: S3_REGION,
    });

    const params = {
        Bucket: BUCKET_NAME,
        Delete: {
            Objects: [],
            Quiet: false,
        },
    };

    const removeAll = () => {
        for(let i = 0; i < place.memoImage.length; i++) {
            const [type, uri] = place.memoImage[i].split('/').slice(-2);
            const key = `${type}/` + decodeURI(uri)
            const newKey = { Key : key }
            params.Delete.Objects.push(newKey)
        }
    }

    const removeOne = (data) => {
        for(let i = 0; i < place.memoImage.length; i++) {
            const [type, uri] = place.memoImage[i].split('/').slice(-2);
            if (decodeURI(uri) === data) {
                const key = `${type}/` + decodeURI(uri)
                const newKey = { Key : key }
                params.Delete.Objects.push(newKey)
            }
        }
    } 
    
    if(uri !== undefined) removeAll();
    else removeOne(uri);
    
    S3.deleteObjects(params, (err, data) => {
        if (err) console.log(err, err.stack);
        // an error occurred
        else console.log(data);
    });
};

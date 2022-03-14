const PlacesService = require('../services/places');

//여행 일정 추가
const postplaces = async (req, res, next) => {
try{
    const { dayId } = req.params;
    const { placeName, lat, lng, address, time, memoText } = req.body;
    // console.log(req.files.imageFile)
    // let videoUrl = [];
    let imageUrl = [];

    // req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
    req.files.imageFile ? (imageUrl = req.files.imageFile) : imageUrl;
    const Places = await PlacesService.createplaces({ dayId, placeName, lat, lng, address, time, memoText, imageUrl });

    return res.json({ result: 'success', message: '작성 완료' });

    }catch(error){
        next(error);
    }
};

//여행 일정 수정
const patchplaces = async (req, res, next) => {
    try{
        const { placeId } = req.params;
        const { placeName, lat, lng, address, time, memoText } = req.body;

        // let videoUrl = [];
        let imageUrl = [];

        // req.files.videoFile ? videoUrl = req.files.videoFile : videoUrl;
        req.files.imageFile ? (imageUrl = req.files.imageFile) : imageUrl;

        const Places = await PlacesService.createplaces({ placeId, placeName, lat, lng, address, time, memoText, imageUrl });

        return res.json({ result: 'success', message: '작성 완료' });

    }catch(error){
        next(error);
    }
};

//여행 일정 삭제
const deleteplaces = async (req, res, next) => {
    try{    
    const { placeId } = req.params;

    return res.json({ result: 'success', message: '삭제 완료' });
    }catch(error){
        next(error);
    }
}

module.exports = {
    postplaces,
    patchplaces,
    deleteplaces
}
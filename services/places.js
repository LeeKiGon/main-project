const Place = require('../models/place');
const Day = require('../models/day');
const Plan = require('../models/plan');


//여행 일정 생성
const createplaces = async ({ dayId, placeName, lat, lng, address, time, memoText, imageUrl }) => {

        const findDay = await Day.findOne({ _id: dayId });
        const findPlan = await Plan.findOne({ _id: findDay.planId });
        if (findPlan.destination === '국내') {
            const splited = address.split(' ');
            findPlan.locations.push(splited[1]);
            findPlan.locations.push(splited[2]);
        }
        if (findPlan.destination === '해외') {
            const country = address.match(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]+/)[0]; //배열에서 한글(정규표현식) 찾아서 변수에 담기
            findPlan.locations.push(country);
        }

        findPlan.locations = [...new Set(findPlan.locations)]; // Set 자료형 사용하여 배열 내 중복값 제거 후 ...(Spread 연산자)로 List 로 변경

        await findPlan.save();

        const newPlace = new Place({
            planId: findDay.planId,
            dayId,
            placeName,
            time,
            lat,
            lng,
            address,
            memoText,
        });

        // for(let i=0; i< videoUrl.length; i++) {
        //     newPlace.memoImage.push(videoUrl[i].location)
        // }
        for (let i = 0; i < imageUrl.length; i++) {
            newPlace.memoImage.push(imageUrl[i].location);
        }
        if (memoText) newPlace.memoText = memoText;

        await newPlace.save();

        // const newDayFind = await Day.findOne({_id: dayId}).populate('places')
        // console.log("newDayFind :",newDayFind)

        return;
    }
//여행 일정 수정
const updataplaces = async ({ placeId, placeName, lat, lng, address, time, memoText, imageUrl }) => {    

        const findPlace = await Place.findOneAndUpdate(
            { _id: placeId },
            { placeName, lat, lng, address, time, memoText, imageUrl }
        );

        // for(let i=0; i< videoUrl.length; i++) {
        //     findPlace.memoImage.push(videoUrl[i].location)
        // }

        for (let i = 0; i < imageUrl.length; i++) {
            findPlace.memoImage.push(imageUrl[i].location);
        }

        if (memoText) updatePlace.memoText = memoText;

        await findPlace.save();              
        return;
    }
    
//여행 일정 삭제
const placesdelete = async({ userId, placeId }) => {
    
    const targetplaces = await Place.findOne({ _id: placeId });
    if (targetplaces.userId.toHexString() !== userId) {
        return res.json({
            result: 'false',
            message: '본인의 일정만 삭제할수있습니다',
        });
    } else {
        await Place.deleteOne({ _id: placeId });
        res.json({
            result: 'success',
            message: '성공',
        });
        return;
    };
};

module.exports = {
    createplaces,
    updataplaces,
    placesdelete
}    
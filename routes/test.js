const express = require('express');
const router = express.Router();

// Schemas
const User = require('../schemas/user');
// const Travel = require('../schemas/travel');
const Comment = require('../schemas/comment');
const Like = require('../schemas/like');
const Day = require('../schemas/day');
const Place = require('../schemas/place');
const Reply = require('../schemas/reply');
const Bookmark = require('../schemas/bookmark');

// const user = new User({ email: "test@test.com",
// nickname:"test",
// profile_img: "testimg",
// provider: "kakao", });

// user.save();
(async () => {
    // const findUser = await User.findOne({ nickname: 'test' }).populate('travels')
    // console.log(findUser)
    // const travel = new Travel({
    //     user_id: findUser._id,    
    //     nickname: findUser.nickname,
    //     start_date: Date.now().toLocaleString(),
    //     end_date: Date.now().toLocaleString(),
    //     category: ['test', 'test2'],
    // })
    // await travel.save()
    // const findTravel = await Travel.findOne({nickname : 'test'}).populate({path: 'days', populate: {path: 'places'}})
    // console.log(findTravel)
    // const day = new Day({
    //     travel_id: findTravel._id,
    //     day_number: 2,    
    // })

    // await day.save();
    // const findDay = await Day.findOne({travel_id: findTravel._id, day_number: 2})

    // const place = new Place({
    //     day_id: findDay._id,
    //     place_name: 'test2',
    //     coordinate: '위도 경도a',
    //     address: '일본',
    //     memolmage: 'URL',
    //     memoText: '맛집',
    // })
    // await place.save()

})();

module.exports = router;
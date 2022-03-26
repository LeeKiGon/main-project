const mongoose = require("mongoose");
const Place = require('../models/reply')
// const Travel = require('./travel');


const DaySchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    dayNumber: {
        type: Number,
    }    
});

DaySchema.virtual('dayId').get(function () {
    return this._id.toHexString();
});

DaySchema.virtual('places',{
    ref: 'Place',
    localField: '_id',
    foreignField: 'dayId',
})

DaySchema.pre(
    'deleteOne',
    { document: false, query: true },
    async function (next) {
        // day id
        const { _id } = this.getFilter();
        // place 전부 삭제
        await Place.deleteMany({ dayId: _id });
        next();
    }
);

DaySchema.set('toJSON', { virtuals: true });
DaySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Day', DaySchema);
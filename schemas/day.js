const mongoose = require("mongoose");
// const Travel = require('./travel');


const DaySchema = new mongoose.Schema({
    travel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel',
    },
    day_number: {
        type: Number,
    }    
});

DaySchema.virtual('day_id').get(function () {
    return this._id.toHexString();
});

DaySchema.virtual('places',{
    ref: 'Place',
    localField: '_id',
    foreignField: 'day_id',
})

DaySchema.set('toJSON', { virtuals: true });
DaySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Day', DaySchema);
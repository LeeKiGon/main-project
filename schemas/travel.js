const mongoose = require("mongoose");

const TravelSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // foreignFields: '_id',
    },    
    nickname:{
        type: String
    },
    start_date: {
        type: String
    },
    end_date: {
        type: String
    },
    category: {
        type: Object
    }
});

TravelSchema.virtual('travel_id').get(function () {
    return this._id.toHexString();
});

TravelSchema.virtual('days',{
    ref: 'Day',
    localField: '_id',
    foreignField: 'travel_id',
})

TravelSchema.set('toJSON', { virtuals: true });
TravelSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Travel', TravelSchema);
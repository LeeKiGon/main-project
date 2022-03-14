const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
    planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan',
    },
    dayId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Day',
    },
    placeName: {
        type: String
    },
    time: {
        type: String
    },
    lat: {
        type: Number
    },
    lng: {
        type: Number
    },
    address: {
        type: String 
    },
    memoImage: {
        type: Array,
    },
    memoText: {
        type: String,
        default: ''
    },
    gemotry: {
        type: Object
    }
},
{ timestamps: true });

PlaceSchema.virtual('placeId').get(function () {
    return this._id.toHexString();
});

PlaceSchema.set('toJSON', { virtuals: true });
PlaceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Place', PlaceSchema);
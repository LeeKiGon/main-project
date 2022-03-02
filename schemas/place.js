const mongoose = require("mongoose");

const PlaceSchema = new mongoose.Schema({
    day_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Day',
    },
    place_name: {
        type: String    
    },
    coordinate: {
        type: String
    },
    address: {
        type: String 
    },
    memolmage: {
        type: String
    },
    memoText: {
        type: String,
    }
},
{ timestamps: true });

PlaceSchema.virtual('place_id').get(function () {
    return this._id.toHexString();
});

PlaceSchema.set('toJSON', { virtuals: true });
PlaceSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Place', PlaceSchema);
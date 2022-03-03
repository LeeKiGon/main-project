const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    snsId: {
        type: String
    },
    email: {
        type: String
    },
    nickname:{
        type: String
    },
    profile_img: {
        type: String
    },
    provider: {
        type: String
    },
});

UserSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});

UserSchema.virtual('plans',{
    ref: 'Plan',
    localField: '_id',
    foreignField: 'userid',
})

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
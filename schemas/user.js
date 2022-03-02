const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    sns_id: {
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

UserSchema.virtual('user_id').get(function () {
    return this._id.toHexString();
});

UserSchema.virtual('travels',{
    ref: 'Travel',
    localField: '_id',
    foreignField: 'user_id',
})

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', UserSchema);
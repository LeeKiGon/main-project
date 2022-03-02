const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
    travel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Like', LikeSchema);
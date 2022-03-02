const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
    travel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Travel',
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
});

module.exports = mongoose.model('Bookmark', BookmarkSchema);
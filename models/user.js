const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    nickname : { type: String, required: true },
    password: { type: String, required: true },
    likedFilmsId: { type: [String], required: true, default: [] },
    dislikedFilmsId: { type: [String], required: true, default: [] },
    opinionsId: { type: [String], required: true, default: [] },
    likedOpinionsId: { type: [String], required: true, default: [] },
    isAdmin: { type: Boolean, required: true, default: false }
});

module.exports = mongoose.model("User", userSchema);
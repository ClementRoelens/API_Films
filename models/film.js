const mongoose = require('mongoose');

const film = mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    likes: { type: Number, required: true, default:[] },
    dislikes: { type: Number, required: true, default:[] },
    opinionsId: { type: [String], required: false, default:[] },
    genres: { type: [String], required: true },
    imageUrl: { type: String, required: true }
});


module.exports = mongoose.model('Film',film);
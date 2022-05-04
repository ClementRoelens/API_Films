const mongoose = require('mongoose');

const filmSchema = mongoose.Schema({
    titre: { type: String, required: true },
    realisateur: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    likes: { type: Number, required: false },
    avis: { type: [String], required: false },
    genre: { type: [String], required: true },
    imageUrl: { type: String, required: true }
});

module.exports = mongoose.model('Film', filmSchema);
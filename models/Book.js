// models/Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number,
    genre: String,
    available: Boolean
});

module.exports = mongoose.model('Book', bookSchema);

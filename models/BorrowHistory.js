// models/BorrowHistory.js
const mongoose = require('mongoose');

const borrowHistorySchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    borrower: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    borrowedAt: { type: Date, default: Date.now },
    returnedAt: Date
});

module.exports = mongoose.model('BorrowHistory', borrowHistorySchema);

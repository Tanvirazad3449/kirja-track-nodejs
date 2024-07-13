const express = require('express');
const router = express.Router();
const BorrowHistory = require('../models/BorrowHistory');

// Get borrow history of a book
router.get('/borrow-history/:id', async (req, res) => {
    try {
        const borrowHistory = await BorrowHistory.find({ book: req.params.id }).populate('borrower');
        res.json(borrowHistory);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


module.exports = router;

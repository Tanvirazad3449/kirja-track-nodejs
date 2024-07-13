const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const BorrowHistory = require('../models/BorrowHistory');
const User = require('../models/User');

// Get all books
router.get('/books', async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a single book
router.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new book
router.post('/books', async (req, res) => {
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishedYear: req.body.publishedYear,
        genre: req.body.genre,
        available: req.body.available
    });

    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a book
router.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBook);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a book
router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Borrow a book
router.post('/books/:id/borrow', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (!book.available) {
            return res.status(400).json({ message: 'Book is not available' });
        }
        const borrower = await User.findById(req.body.borrowerId);

        if (!borrower) {
            return res.status(404).json({ message: 'Borrower not found' });
        }

        const borrowRecord = new BorrowHistory({
            book: book._id,
            borrower: req.body.borrowerId
        });

        await borrowRecord.save();

        book.available = false;
        await book.save();

        res.json(borrowRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Return a book

router.post('/books/:id/return', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.available) {
            return res.status(400).json({ message: 'Book is already available' });
        }

        const borrowRecord = await BorrowHistory.findOne({ 
            book: book._id, 
            returnedAt: null 
        }).populate('borrower'); // Optionally populate borrower details

        if (!borrowRecord) {
            return res.status(404).json({ message: 'No active borrow record found' });
        }

        borrowRecord.returnedAt = new Date();
        await borrowRecord.save();

        book.available = true;
        await book.save();

        res.json(borrowRecord);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});




module.exports = router;

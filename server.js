const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const borrowHistoryRoutes = require('./routes/borrowHistoryRoutes'); // Import user routes

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api', bookRoutes);  // Use the book routes
app.use('/api', userRoutes); // Use user routes
app.use('/api', borrowHistoryRoutes); // Use user routes

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/library', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

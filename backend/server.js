// server.js
const express = require('express');
const mongoose = require('mongoose'); // Mongoose to interact with MongoDB
const app = express();
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

// Middleware for parsing JSON requests
app.use(express.json());

// Connect to MongoDB
mongoose.connect('your_mongoDB_connection_string')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Could not connect to MongoDB', err));


// Test Route to confirm server is running
app.get('/', (req, res) => {
    res.send('Server is running');
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

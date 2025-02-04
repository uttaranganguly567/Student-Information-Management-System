require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const courseRoutes = require('./routes/courseRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Import Routes
// Import other routes

// Use Routes
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/auth', authRoutes);
// Use other routes

// MongoDB connection
mongoose.connect('mongodb+srv://uttaranganguly20:uttaran123@cluster0.mpxcf.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error(err));

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

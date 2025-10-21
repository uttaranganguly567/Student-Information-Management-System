// backend/models/Assignment.js
// --- CREATE THIS NEW FILE ---

const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  course: { // Which course this assignment belongs to
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true,
  },
  teacher: { // Which teacher created this assignment
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  dueDate: {
    type: Date,
  },
  // Optional: Add total points/marks later
  // totalPoints: { type: Number }
}, {
  timestamps: true // Adds createdAt, updatedAt
});

module.exports = mongoose.model('Assignment', assignmentSchema);
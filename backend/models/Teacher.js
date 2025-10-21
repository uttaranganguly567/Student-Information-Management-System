// backend/models/Teacher.js
// --- FULL REPLACEABLE CODE ---

const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  department: {
    type: String,
  },
  // --- NEW FIELD ---
  // Array to store IDs of courses the teacher is assigned to
  assigned_courses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses' // References the 'Courses' model
  }]
  // ---------------
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
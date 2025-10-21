// backend/models/Submission.js
// --- FULL REPLACEABLE CODE ---

const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  course: { // Denormalized for easier queries
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Courses',
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  content: { // Text submission
    type: String,
    trim: true,
  },
  // --- NEW FIELDS ---
  grade: { // Grade assigned by teacher
    type: String, // Use String to allow 'A+', 'Pass', '85/100', etc.
    trim: true,
  },
  feedback: { // Feedback from teacher
    type: String,
    trim: true,
  },
  gradedAt: { // When it was graded
      type: Date,
  }
  // -----------------
}, {
  timestamps: true
});

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Submission', submissionSchema);
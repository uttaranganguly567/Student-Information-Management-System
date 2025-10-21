// backend/models/Courses.js
// --- FULL REPLACEABLE CODE ---

const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_id: {type: String, required: true, unique: true},
    course_name: {type: String, required: true},
    year: {type: Number},
    published_date: {type: Date},
    credit: {type: Number},
    // --- NEW FIELDS ---
    // Reference to the assigned teacher
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher' // References the 'Teacher' model
    },
    // Array of students enrolled in this course
    enrolled_students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student' // References the 'Student' model
    }]
    // ----------------
});

module.exports = mongoose.model('Courses', courseSchema);
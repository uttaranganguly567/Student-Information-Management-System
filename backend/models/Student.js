// backend/models/Student.js
// --- FULL REPLACEABLE CODE ---

const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true, unique: true },
    year: { type: Number },
    department: { type: String },
    age: { type: Number },
    mobile: { type: String },
    // --- NEW FIELD ---
    // Array to store IDs of courses the student is enrolled in
    enrolled_courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Courses' // References the 'Courses' model
    }]
    // ---------------
});

module.exports = mongoose.model('Student', studentSchema);
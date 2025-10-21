// backend/routes/studentRoutes.js
// --- FULL REPLACEABLE CODE (Focus on GET /:id Population) ---

const express = require('express');
const router = express.Router();
const Student = require('../models/Student.js');
const User = require('../models/User.js');
const Fees = require('../models/Fees.js');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// @route   GET /api/students
router.get('/', protect, async (req, res) => { /* ... */ });

// @route   GET /api/students/:id
router.get('/:id', protect, async (req, res) => {
  const studentId = req.params.id; // Get ID for logging
  console.log(`--- GET /api/students/${studentId} ---`); // Log route entry

  if (!mongoose.Types.ObjectId.isValid(studentId)) {
    console.log("--> Invalid ID format.");
    return res.status(400).json({ msg: 'Invalid student ID format' });
  }

  try {
    console.log("--> Finding student by ID...");
    const student = await Student.findById(studentId); // Find first without populate

    if (!student) {
        console.log("--> Student not found.");
        return res.status(404).json({ msg: 'Student not found' });
    }
    console.log("--> Student found. Enrolled course IDs:", student.enrolled_courses); // Log IDs before populate

    // --- Explicitly Populate ---
    console.log("--> Attempting to populate enrolled_courses...");
    await student.populate({
        path: 'enrolled_courses',
        select: '_id course_name' // Select only these fields from Course model
    });
    // -------------------------

    console.log("--> Population attempt finished. Populated courses:", student.enrolled_courses); // Log result AFTER populate
    // Check if population actually worked (are they objects with course_name?)
    if (student.enrolled_courses && student.enrolled_courses.length > 0 && !student.enrolled_courses[0].course_name) {
        console.error("--> POPULATION FAILED! enrolled_courses contains IDs, not objects.");
        // Decide how to handle: send anyway, or send error? Sending anyway for now.
    } else if (student.enrolled_courses && student.enrolled_courses.length > 0) {
        console.log("--> Population appears successful.");
    } else {
        console.log("--> No enrolled courses to populate or array is empty.");
    }

    res.json(student); // Send the potentially populated student object

  } catch (err) {
    console.error(`--> ERROR in GET /api/students/${studentId}:`, err);
    res.status(500).json({ msg: `Server Error GET /${studentId}`, error: err.message });
  }
});

// @route   POST /api/students
router.post('/', protect, async (req, res) => { /* ... */ });

// @route   PUT /api/students/myprofile
router.put('/myprofile', protect, async (req, res) => { /* ... */ });

// @route   PUT /api/students/:id (Admin Update)
router.put('/:id', protect, async (req, res) => { /* ... */ });

// @route   DELETE /api/students/:id (Admin Delete)
router.delete('/:id', protect, async (req, res) => { /* ... */ });

module.exports = router;
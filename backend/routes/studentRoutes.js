const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Get all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new student
router.post('/', async (req, res) => {
    const student = new Student({
        name: req.body.name,
        roll: req.body.roll,
        year: req.body.year,
        department: req.body.department,
        age: req.body.age,
        mobile: req.body.mobile,
        student_id: req.body.student_id,
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Add more routes for updating, deleting, etc.

module.exports = router;
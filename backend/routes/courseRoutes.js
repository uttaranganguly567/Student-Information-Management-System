const express = require('express');
const router = express.Router();
const Course = require('../models/Courses'); // Assuming you have the Course model set up

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.find(); // Find all courses
        res.json(courses); // Send the courses as a response
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle any errors
    }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id); // Find course by ID
        if (course) {
            res.json(course); // Send course as a response
        } else {
            res.status(404).json({ message: 'Course not found' }); // Handle case where course is not found
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new course
router.post('/', async (req, res) => {
    const course = new Course({
        course_id: req.body.course_id,
        course_name: req.body.course_name,
        year: req.body.year,
        published_date: req.body.published_date,
    });

    try {
        const newCourse = await course.save(); // Save the new course to the database
        res.status(201).json(newCourse); // Return the saved course
    } catch (err) {
        res.status(400).json({ message: err.message }); // Handle errors while saving
    }
});

// Update a course by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true } // Return the updated document
        );
        if (updatedCourse) {
            res.json(updatedCourse); // Return the updated course
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        res.status(400).json({ message: err.message }); // Handle errors during update
    }
});

// Delete a course by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);
        if (deletedCourse) {
            res.json({ message: 'Course deleted successfully' }); // Return a success message
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message }); // Handle any errors during deletion
    }
});

module.exports = router;

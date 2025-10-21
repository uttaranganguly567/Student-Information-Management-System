// backend/routes/teacherRoutes.js
// --- FULL REPLACEABLE CODE ---

const express = require('express');
const router = express.Router();
const Teacher = require('../models/Teacher.js');
const User = require('../models/User.js');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose'); // Import mongoose

// --- NEW ROUTE ---
// @route   GET /api/teachers/myprofile
// @desc    Get the logged-in teacher's profile and assigned courses
// @access  Private (Teachers Only)
router.get('/myprofile', protect, async (req, res) => {
  // 1. Check if user is a teacher and has a profile linked
  if (req.user.role !== 'teacher' || !req.user.profileId) {
    return res.status(403).json({ msg: 'Not authorized or teacher profile not linked.' });
  }

  try {
    // 2. Find teacher profile and populate assigned_courses with course details
    const teacher = await Teacher.findById(req.user.profileId)
                             .populate('assigned_courses', 'course_id course_name'); // Get course ID and name

    if (!teacher) {
      return res.status(404).json({ msg: 'Teacher profile not found.' });
    }
    res.json(teacher); // Send back teacher profile with populated courses

  } catch (err) {
    console.error(`ERROR fetching teacher profile (${req.user.profileId}):`, err.message);
    res.status(500).json({ msg: 'Server Error: Could not fetch profile.' });
  }
});
// -----------------

// @route   GET /api/teachers
// @desc    Get all teachers (Admin Only)
router.get('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); } // Added role check
  try {
    const teachers = await Teacher.find().sort({ name: 1 });
    res.json(teachers);
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error' }); }
});

// @route   GET /api/teachers/:id
// @desc    Get a single teacher by ID (Admin Only)
router.get('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); } // Added role check
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid ID format' }); }
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) { return res.status(404).json({ msg: 'Teacher not found' }); }
    res.json(teacher);
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error' }); }
});


// @route   POST /api/teachers
// @desc    Add a new teacher (Admin Only)
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); } // Added role check
  const { name, department } = req.body;
  try {
    const newTeacher = new Teacher({ name, department });
    await newTeacher.save();
    res.json(newTeacher);
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error: Could not add teacher' }); }
});

// @route   PUT /api/teachers/:id
// @desc    Update a teacher's profile (Admin Only)
router.put('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); } // Added role check
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid ID format' }); }
  const { name, department } = req.body;
  try {
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (department !== undefined) updates.department = department;
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { $set: updates }, { new: true, runValidators: true });
    if (!teacher) { return res.status(404).json({ msg: 'Teacher not found' }); }
    res.json(teacher);
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error: Could not update teacher' }); }
});

// @route   DELETE /api/teachers/:id
// @desc    Delete a teacher profile AND associated User login (Admin Only)
router.delete('/:id', protect, async (req, res) => {
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); } // Added role check
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid ID format' }); }
  try {
    const teacherId = req.params.id;
    const teacher = await Teacher.findById(teacherId);
    if (!teacher) { return res.status(404).json({ msg: 'Teacher not found' }); }
    await Teacher.findByIdAndDelete(teacherId);
    await User.findOneAndDelete({ profileId: teacherId, role: 'teacher' });
    // Optional: Unassign teacher from courses
    // await Course.updateMany({ teacher: teacherId }, { $unset: { teacher: "" } });
    res.json({ msg: 'Teacher and associated user account removed' });
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error: Could not delete teacher' }); }
});

module.exports = router;
// backend/routes/dashboardRoutes.js
// --- FULL REPLACEABLE CODE (FIXED STUDENT STATS) ---

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/Student'); // Need Student model
const Course = require('../models/Courses');
const Fees = require('../models/Fees');
const { protect } = require('../middleware/authMiddleware'); // Added protect middleware

// @route   GET /api/dashboard/stats/admin
// @desc    Get dashboard statistics for ADMIN
// @access  Private (Admin Only - needs role check)
router.get('/stats/admin', protect, async (req, res) => { // Added protect
  // Add admin role check later
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); }
  try {
    const totalStudents = await Student.countDocuments();
    const totalCourses = await Course.countDocuments();
    const feesDueAgg = await Fees.aggregate([
      { $match: { is_paid: false } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalFeesDue = feesDueAgg.length > 0 ? feesDueAgg[0].total : 0;
    res.json({ totalStudents, totalCourses, totalFeesDue });
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error - Admin Stats' }); }
});

// @route   GET /api/dashboard/stats/student/:studentId
// @desc    Get dashboard statistics for a single STUDENT
// @access  Private (Needs check: is it the logged-in student?)
router.get('/stats/student/:studentId', protect, async (req, res) => { // Added protect
  // --- STUDENT ID VALIDATION ---
  if (!mongoose.Types.ObjectId.isValid(req.params.studentId)) {
    return res.status(400).json({ msg: 'Invalid Student ID format.' });
  }
  // --- AUTHORIZATION CHECK ---
  // Ensure the logged-in user matches the requested studentId
  if (req.user.role !== 'student' || req.user.profileId?.toString() !== req.params.studentId) {
       // Also allow admin access for potential future use?
       if (req.user.role !== 'admin') {
            console.warn(`Unauthorized attempt to access student stats. User: ${req.user._id}, Requested: ${req.params.studentId}`);
            return res.status(403).json({ msg: 'Not authorized to view these stats.' });
       }
  }

  try {
    const studentId = new mongoose.Types.ObjectId(req.params.studentId);

    // 1. Fetch the student document to get enrolled courses
    const student = await Student.findById(studentId).select('enrolled_courses'); // Only select needed field
    if (!student) {
        return res.status(404).json({ msg: 'Student profile not found.' });
    }
    const enrolledCoursesCount = student.enrolled_courses ? student.enrolled_courses.length : 0; // Get count

    // 2. Aggregate total fees for this student (this part was correct)
    const feeStats = await Fees.aggregate([
      { $match: { student: studentId } },
      {
        $group: {
          _id: null,
          totalDue: { $sum: { $cond: [{ $eq: ['$is_paid', false] }, '$amount', 0] } },
          totalPaid: { $sum: { $cond: [{ $eq: ['$is_paid', true] }, '$amount', 0] } }
        }
      }
    ]);

    res.json({
      totalDue: feeStats.length > 0 ? feeStats[0].totalDue : 0,
      totalPaid: feeStats.length > 0 ? feeStats[0].totalPaid : 0,
      // 3. Return the correct enrolled course count
      enrolledCoursesCount: enrolledCoursesCount
    });

  } catch (err) {
    console.error(`ERROR fetching student stats (${req.params.studentId}):`, err.message);
    res.status(500).json({ msg: 'Server Error - Student Stats' });
  }
});

module.exports = router;
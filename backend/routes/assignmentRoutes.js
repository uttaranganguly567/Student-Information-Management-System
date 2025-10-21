// backend/routes/assignmentRoutes.js
// --- FULL REPLACEABLE CODE (Complete File with Logging) ---

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Assignment = require('../models/Assignment.js');
const Submission = require('../models/Submission.js');
const Course = require('../models/Courses.js');
const Student = require('../models/Student.js'); // Needed for potential checks
const { protect } = require('../middleware/authMiddleware.js');

// @route   POST /api/assignments
// @desc    Create a new assignment for a course (Teachers Only)
router.post('/', protect, async (req, res) => {
    // Basic implementation - Assumes role check is sufficient for now
    if (!req.user || req.user.role !== 'teacher' || !req.user.profileId) { return res.status(403).json({ msg: 'Not authorized or teacher profile not linked.' }); }
    const { courseId, title, description, dueDate } = req.body;
    if (!courseId || !title || !mongoose.Types.ObjectId.isValid(courseId)) { return res.status(400).json({ msg: 'Valid courseId and title required.' }); }
    try {
        const course = await Course.findById(courseId);
        if (!course || !course.teacher || course.teacher.toString() !== req.user.profileId.toString()) { return res.status(403).json({ msg: 'Course not found or you do not teach it.' }); }
        const newAssignment = new Assignment({ course: courseId, teacher: req.user.profileId, title, description, dueDate });
        const savedAssignment = await newAssignment.save();
        res.status(201).json(savedAssignment);
    } catch (err) {
        console.error("ERR POST /assignments:", err);
        if (err.name === 'ValidationError') { return res.status(400).json({ msg: 'Validation Error', errors: err.errors }); }
        res.status(500).json({ msg: 'Server Error: Could not create assignment.', error: err.message });
    }
});

// @route   GET /api/assignments/course/:courseId
// @desc    Get all assignments for a specific course
// @access  Private (Students/Teachers enrolled/assigned) - relies on protect for login
router.get('/course/:courseId', protect, async (req, res) => {
    const { courseId } = req.params;
    console.log(`--- Backend: GET /api/assignments/course/${courseId} ---`); // Log entry

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        console.log("--> Invalid Course ID format.");
        return res.status(400).json({ msg: 'Invalid Course ID format.' });
    }

    try {
        console.log(`--> Finding assignments where { course: "${courseId}" } ...`);
        const query = { course: new mongoose.Types.ObjectId(courseId) }; // Ensure ObjectId
        const assignments = await Assignment.find(query)
                                            .sort({ createdAt: -1 })
                                            .populate('teacher', 'name')
                                            .lean(); // Use lean for performance

        console.log(`--> DB Query finished. Found ${assignments.length} assignments for course ${courseId}.`);

        // *** Ensure response is ALWAYS sent ***
        console.log("--> Sending assignments response.");
        res.status(200).json(assignments); // Send success response
        console.log("--> Assignments response sent.");


    } catch (err) {
        console.error(`--> ERROR GET /api/assignments/course/${courseId}:`, err);
        // *** Ensure error response is ALWAYS sent ***
        if (!res.headersSent) { // Check if response hasn't already been sent
             console.log("--> Sending error response.");
             res.status(500).json({ msg: 'Server Error: Could not fetch assignments.', error: err.message });
        } else {
            console.error("--> Headers already sent, cannot send error response for GET /course/:id.");
        }
    }
});

// @route   GET /api/assignments/:assignmentId/submissions
// @desc    Get all submissions for an assignment (Teacher Only)
router.get('/:assignmentId/submissions', protect, async (req, res) => {
    const { assignmentId } = req.params;
    // console.log(`--- Backend: GET /api/assignments/${assignmentId}/submissions ---`);
    if (!req.user || req.user.role !== 'teacher' || !req.user.profileId) { return res.status(403).json({ msg: 'Not authorized.' }); }
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) { return res.status(400).json({ msg: 'Invalid Assignment ID format.' }); }
    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment || assignment.teacher.toString() !== req.user.profileId.toString()) { return res.status(403).json({ msg: 'Assignment not found or not authorized.' }); }
        const submissions = await Submission.find({ assignment: assignmentId }).populate('student', 'name roll').sort({ submittedAt: -1 });
        // console.log(`--> Found ${submissions.length} submissions.`);
        res.json(submissions);
    } catch (err) { console.error(`--> ERROR GET /submissions ${assignmentId}:`, err); if (!res.headersSent) { res.status(500).json({ msg: 'Server Error.', error: err.message }); } }
});

// @route   POST /api/assignments/:assignmentId/submit
// @desc    Submit an assignment (Students Only)
router.post('/:assignmentId/submit', protect, async (req, res) => {
    const { assignmentId } = req.params;
    const { content } = req.body;
    // console.log(`--- Backend: POST /api/assignments/${assignmentId}/submit ---`);
    if (!req.user || req.user.role !== 'student' || !req.user.profileId) { return res.status(403).json({ msg: 'Only students can submit.' }); }
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) { return res.status(400).json({ msg: 'Invalid Assignment ID format.' }); }
    if (!content || content.trim() === '') { return res.status(400).json({ msg: 'Submission content empty.' }); }
    try {
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) { return res.status(404).json({ msg: 'Assignment not found.' }); }
        const existingSubmission = await Submission.findOne({ assignment: assignmentId, student: req.user.profileId });
        if (existingSubmission) { return res.status(400).json({ msg: 'Already submitted.' }); }
        const newSubmission = new Submission({ assignment: assignmentId, student: req.user.profileId, course: assignment.course, content: content.trim(), submittedAt: new Date() });
        const savedSubmission = await newSubmission.save();
        res.status(201).json(savedSubmission);
    } catch (err) { console.error(`--> ERROR POST /submit ${assignmentId}:`, err); if (!res.headersSent) { if (err.code === 11000) { return res.status(400).json({ msg: 'Submission already exists (race).' }); } res.status(500).json({ msg: 'Server Error.', error: err.message }); } }
});

// @route   PUT /api/assignments/submissions/:submissionId/grade
// @desc    Grade a specific submission (Teachers Only)
router.put('/submissions/:submissionId/grade', protect, async (req, res) => {
    const { submissionId } = req.params;
    const { grade, feedback } = req.body;
    // console.log(`--- Backend: PUT /api/assignments/submissions/${submissionId}/grade ---`);
    if (!req.user || req.user.role !== 'teacher' || !req.user.profileId) { return res.status(403).json({ msg: 'Not authorized.' }); }
    if (!mongoose.Types.ObjectId.isValid(submissionId)) { return res.status(400).json({ msg: 'Invalid Submission ID format.' }); }
    try {
        const submission = await Submission.findById(submissionId).populate({ path: 'assignment', select: 'teacher' });
        if (!submission) { return res.status(404).json({ msg: 'Submission not found.' }); }
        if (!submission.assignment || submission.assignment.teacher.toString() !== req.user.profileId.toString()) { return res.status(403).json({ msg: 'Cannot grade submissions for others assignments.' }); }
        submission.grade = grade; submission.feedback = feedback; submission.gradedAt = new Date();
        const updatedSubmission = await submission.save();
        res.json(updatedSubmission);
    } catch (err) { console.error(`--> ERROR PUT /grade ${submissionId}:`, err); if (!res.headersSent) { if (err.name === 'ValidationError') { return res.status(400).json({ msg: 'Validation Error', errors: err.errors }); } res.status(500).json({ msg: 'Server Error.', error: err.message }); } }
});

// @route   GET /api/assignments/:assignmentId/mysubmission
// @desc    Get the logged-in student's submission for a specific assignment
// @access  Private (Students Only)
router.get('/:assignmentId/mysubmission', protect, async (req, res) => {
    // 1. Check if user is a student
    if (!req.user || req.user.role !== 'student' || !req.user.profileId) {
        // console.log("--> /mysubmission: Auth Fail - Not student or profile missing.");
        return res.status(403).json({ msg: 'Not authorized or student profile missing.' });
    }
    const { assignmentId } = req.params;
    // 2. Validate Assignment ID
    if (!mongoose.Types.ObjectId.isValid(assignmentId)) {
        // console.log("--> /mysubmission: Invalid Assignment ID format:", assignmentId);
        return res.status(400).json({ msg: 'Invalid Assignment ID format.' });
    }
    try {
        // console.log(`--- Backend: GET /mysubmission for AssignID: ${assignmentId}, StudentID: ${req.user.profileId} ---`);
        // 3. Find the submission matching assignment AND student
        const submission = await Submission.findOne({
            assignment: new mongoose.Types.ObjectId(assignmentId),
            student: req.user.profileId
        }).lean(); // Use .lean()

        if (!submission) {
            // console.log("--> No submission found for this student/assignment.");
            return res.status(404).json({ msg: 'Submission not found.' });
        }
        // console.log("--> Submission found, sending response.");
        // 4. Send the submission data
        res.status(200).json(submission);
        // console.log("--> /mysubmission response sent.");

    } catch (err) {
        console.error(`--> ERROR GET /mysubmission for AssignID ${assignmentId}:`, err);
        if (!res.headersSent) {
             res.status(500).json({ msg: 'Server Error: Could not fetch submission.', error: err.message });
        }
    }
});


module.exports = router;
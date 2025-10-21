// backend/routes/courseRoutes.js
// --- FULL REPLACEABLE CODE (SYNTAX FIX 2) ---

const express = require('express');
const router = express.Router();
const Course = require('../models/Courses.js');
const Student = require('../models/Student.js');
const Teacher = require('../models/Teacher.js');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

// @route   GET /api/courses
router.get('/', protect, async (req, res) => {
  try {
    const courses = await Course.find().sort({ course_name: 1 }).populate('teacher', 'name');
    res.json(courses);
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error GET /' }); }
});

// @route   GET /api/courses/:id
router.get('/:id', protect, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid ID format' }); }
  try {
    const course = await Course.findById(req.params.id).populate('teacher', 'name');
    if (!course) { return res.status(404).json({ msg: 'Course not found' }); }
    res.json(course);
  } catch (err) { console.error(err.message); res.status(500).json({ msg: `Server Error GET /${req.params.id}` }); }
});

// @route   POST /api/courses
router.post('/', protect, async (req, res) => {
  if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); }
  const { course_id, course_name, year, credit, teacher: teacherId } = req.body;
  try {
    let course = await Course.findOne({ course_id });
    if (course) { return res.status(400).json({ msg: 'Course ID already exists' }); }
    course = new Course({ course_id, course_name, year, credit, teacher: teacherId || null, published_date: new Date() });
    await course.save();
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
        await Teacher.findByIdAndUpdate(teacherId, { $addToSet: { assigned_courses: course._id } });
    }
    res.status(201).json(course);
  } catch (err) { console.error("ERROR in POST /api/courses:", err); res.status(500).json({ msg: 'Server Error: Could not add course', error: err.message }); }
});

// @route   PUT /api/courses/:id
router.put('/:id', protect, async (req, res) => {
  // --- Admin Role Check ---
  if (!req.user || req.user.role !== 'admin') {
     console.log(`PUT /courses/${req.params.id}: Unauthorized attempt by user ${req.user?._id}`);
     return res.status(403).json({ msg: 'Not authorized' });
   }
  // --- ID Validation ---
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      console.log(`PUT /courses/${req.params.id}: Invalid Course ID format received.`);
      return res.status(400).json({ msg: 'Invalid Course ID format' });
  }

  const { course_id, course_name, year, credit, teacher: newTeacherIdString } = req.body;
  const courseId = req.params.id; // Course being updated (string)
  const courseObjectId = new mongoose.Types.ObjectId(courseId); // Convert to ObjectId for comparisons

  console.log(`\n--- Attempting PUT /api/courses/${courseId} ---`);
  console.log("Request Body:", req.body);

  try {
    // 1. Find the course *before* updating
    console.log("Step 1: Finding original course...");
    const course = await Course.findById(courseId);
    if (!course) {
        console.log("--> Course not found.");
        return res.status(404).json({ msg: 'Course not found' });
    }
    const oldTeacherIdString = course.teacher ? course.teacher.toString() : null;
    console.log(`--> Found course. Old Teacher ID: ${oldTeacherIdString}`);

    // 2. Check if new course_id is taken (if provided)
    if (course_id) {
        console.log("Step 2: Checking if new course_id is taken...");
        const idExists = await Course.findOne({ course_id: course_id, _id: { $ne: courseObjectId } });
        if (idExists) {
            console.log(`--> New course_id '${course_id}' already exists.`);
            return res.status(400).json({ msg: 'Course ID is already in use' });
        }
        console.log("--> New course_id is available.");
    }

    // 3. Prepare course updates
    console.log("Step 3: Preparing course updates...");
    const updates = {};
    if (course_id !== undefined) updates.course_id = course_id;
    if (course_name !== undefined) updates.course_name = course_name;
    if (year !== undefined) updates.year = year;
    if (credit !== undefined) updates.credit = credit;
    // Ensure teacher ID is valid ObjectId or null
    const newTeacherObjectId = (newTeacherIdString && mongoose.Types.ObjectId.isValid(newTeacherIdString)) ? new mongoose.Types.ObjectId(newTeacherIdString) : null;
    updates.teacher = newTeacherObjectId;
    console.log("--> Updates prepared:", updates);

    // 4. Update the course document
    console.log("Step 4: Updating course document...");
    const updatedCourse = await Course.findByIdAndUpdate(courseObjectId, { $set: updates }, { new: true });
    if (!updatedCourse) {
        console.log("--> Course not found during update step.");
        return res.status(404).json({ msg: 'Course not found during update.' });
    }
    const currentTeacherIdString = updatedCourse.teacher ? updatedCourse.teacher.toString() : null;
    console.log(`--> Course updated. New Teacher ID: ${currentTeacherIdString}`);

    // --- 5. Update Teacher documents ---
    console.log("Step 5: Updating Teacher documents if necessary...");
    const teacherUpdates = [];

    // If teacher was removed or changed
    if (oldTeacherIdString && oldTeacherIdString !== currentTeacherIdString) {
      if (mongoose.Types.ObjectId.isValid(oldTeacherIdString)) {
          console.log(`--> Attempting to REMOVE course ${courseId} from OLD teacher ${oldTeacherIdString}`);
          teacherUpdates.push(
            Teacher.findByIdAndUpdate(oldTeacherIdString, { $pull: { assigned_courses: courseObjectId } })
              .then(result => console.log(`--> Remove result for old teacher ${oldTeacherIdString}:`, result ? 'OK' : 'Not Found/Error'))
              .catch(err => console.error(`--> ERROR removing from old teacher ${oldTeacherIdString}:`, err))
          );
      } else {
          console.warn(`--> Invalid ObjectId for old teacher: ${oldTeacherIdString}. Skipping removal.`);
      }
    } else {
         console.log("--> Old teacher unchanged or was null.");
    }

    // If a new teacher was added (and wasn't the old one)
    if (currentTeacherIdString && currentTeacherIdString !== oldTeacherIdString) {
      if (mongoose.Types.ObjectId.isValid(currentTeacherIdString)) {
          console.log(`--> Attempting to ADD course ${courseId} to NEW teacher ${currentTeacherIdString}`);
          teacherUpdates.push(
            Teacher.findByIdAndUpdate(currentTeacherIdString, { $addToSet: { assigned_courses: courseObjectId } })
             .then(result => console.log(`--> Add result for new teacher ${currentTeacherIdString}:`, result ? 'OK' : 'Not Found/Error'))
             .catch(err => console.error(`--> ERROR adding to new teacher ${currentTeacherIdString}:`, err))
          );
      } else {
          console.error(`--> Invalid ObjectId for new teacher: ${currentTeacherIdString}. Skipping add.`);
      }
    } else {
        console.log("--> New teacher unchanged or is null.");
    }

    // Wait for teacher updates to complete
    if (teacherUpdates.length > 0) {
        console.log("--> Waiting for teacher updates to complete...");
        await Promise.all(teacherUpdates);
        console.log("--> Teacher updates finished.");
    } else {
        console.log("--> No teacher updates needed.");
    }
    // ---------------------------------

    console.log("--- PUT Request Successful ---");
    res.json(updatedCourse); // Send back the updated course
  } catch (err) {
    console.error(`--- ERROR in PUT /api/courses/${courseId}: ---`); console.error(err);
    if (err.name === 'ValidationError') { return res.status(400).json({ msg: 'Validation Error', errors: err.errors }); }
    res.status(500).json({ msg: 'Server Error: Could not update course.', error: err.message });
  }
});

// @route   DELETE /api/courses/:id
router.delete('/:id', protect, async (req, res) => {
 if (req.user.role !== 'admin') { return res.status(403).json({ msg: 'Not authorized' }); }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid ID format' }); }
  const courseId = req.params.id;
  try {
    const course = await Course.findById(courseId);
    if (!course) { return res.status(404).json({ msg: 'Course not found' }); }
    const teacherId = course.teacher ? course.teacher.toString() : null;
    await Student.updateMany({ enrolled_courses: courseId }, { $pull: { enrolled_courses: courseId } });
    if (teacherId && mongoose.Types.ObjectId.isValid(teacherId)) {
      await Teacher.findByIdAndUpdate(teacherId, { $pull: { assigned_courses: courseId } });
    }
    await Course.findByIdAndDelete(courseId);
    res.json({ msg: 'Course removed' });
  } catch (err) { console.error(err.message); res.status(500).json({ msg: 'Server Error: Could not delete course' }); }
});


// @route   POST /api/courses/:id/enroll
router.post('/:id/enroll', protect, async (req, res) => {
  try {
    if (req.user.role !== 'student' || !req.user.profileId) { return res.status(403).json({ msg: 'Only students can enroll' }); }
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid Course ID format' }); }
    const course = await Course.findById(req.params.id);
    if (!course) { return res.status(404).json({ msg: 'Course not found' }); }
    const student = await Student.findById(req.user.profileId);
    if (!student) { return res.status(404).json({ msg: 'Student profile not found' }); }
    const isAlreadyEnrolledInStudent = student.enrolled_courses.includes(course._id);
    const isAlreadyEnrolledInCourse = course.enrolled_students.includes(student._id);
    if (isAlreadyEnrolledInStudent || isAlreadyEnrolledInCourse) { return res.status(400).json({ msg: 'Student already enrolled in this course' }); }
    student.enrolled_courses.push(course._id);
    await student.save();
    course.enrolled_students.push(student._id);
    await course.save();
    res.json({ msg: 'Successfully enrolled in course' });
  } catch (err) {
    console.error(`ERROR in POST /enroll for course ${req.params.id}:`, err); // Log the full error
    // --- THIS IS THE FIX ---
    // Ensure the catch block is complete
    res.status(500).json({ msg: 'Server Error during enrollment.', error: err.message });
    // ---------------------
  }
});


// @route   GET /api/courses/:id/students
router.get('/:id/students', protect, async (req, res) => {
 if (req.user.role !== 'teacher') { return res.status(403).json({ msg: 'Not authorized' }); }
 if (!mongoose.Types.ObjectId.isValid(req.params.id)) { return res.status(400).json({ msg: 'Invalid Course ID format' }); }
 try {
   const course = await Course.findById(req.params.id).populate('enrolled_students', 'name roll department year');
   if (!course) { return res.status(404).json({ msg: 'Course not found' }); }
   if (!course.teacher || !req.user.profileId || course.teacher.toString() !== req.user.profileId.toString()) { return res.status(403).json({ msg: 'You are not assigned to teach this course.' }); }
   res.json(course.enrolled_students);
 } catch (err) { console.error(`ERROR fetching students for course ${req.params.id}:`, err.message); res.status(500).json({ msg: 'Server Error' }); }
});


module.exports = router;
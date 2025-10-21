// backend/routes/authRoutes.js
// --- FULL REPLACEABLE CODE ---

const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher'); // 1. Import Teacher model
const generateToken = require('../utils/generateToken');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  const { username, password, role, name, roll } = req.body; // 'name' will be used for both

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ msg: 'Username already exists' });
    }

    let profileId = null;

    // --- UPDATED LOGIC ---
    if (role === 'student') {
      const studentExists = await Student.findOne({ roll });
      if (studentExists) {
        return res.status(400).json({ msg: 'Roll number already exists' });
      }
      const newStudent = await Student.create({ name, roll });
      profileId = newStudent._id;
    } else if (role === 'teacher') {
      // 2. Handle teacher registration
      // For now, just use the 'name' field from the form
      // We assume teacher usernames are unique for simplicity
      const newTeacher = await Teacher.create({ name });
      profileId = newTeacher._id;
    }
    // No profile needed for 'admin' role
    // ---------------------

    const user = await User.create({
      username,
      password,
      role,
      profileId: profileId,
    });

    if (user) {
      generateToken(res, user._id, user.role);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        role: user.role,
        profileId: user.profileId,
      });
    } else {
      res.status(400).json({ msg: 'Invalid user data' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/auth/login
// ... (Login route is unchanged) ...
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id, user.role);
      res.json({
        _id: user._id,
        username: user.username,
        role: user.role,
        profileId: user.profileId,
      });
    } else {
      res.status(401).json({ msg: 'Invalid username or password' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


// @route   POST /api/auth/logout
// ... (Logout route is unchanged) ...
router.post('/logout', (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ msg: 'Logged out successfully' });
});

module.exports = router;
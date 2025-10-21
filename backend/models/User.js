// backend/models/User.js
// --- FULL REPLACEABLE CODE ---

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// 1. Import the new Teacher model
const Student = require('./Student');
const Teacher = require('./Teacher');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student',
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    // 2. This refPath now correctly points 'teacher' to the 'Teacher' model
    refPath: 'role',
  },
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);
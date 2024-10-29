const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    roll: { type: String, required: true, unique: true },
    year: { type: Number, required: true },
    department: { type: String, required: true },
    age: {type: Number},
    mobile: {type: Number},
    student_id: {type: String}
});

module.exports = mongoose.model('Student', studentSchema);
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
    teacher_id: {type: Number, required: true},
    teacher_name: {type: String, required: true},
    teacher_salary: {type: Number}
});

module.exports = mongoose.model('Teacher', teacherSchema);
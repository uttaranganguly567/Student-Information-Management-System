const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    student_name: {type: String, required: true},
    roll: {type: Number, required: true},
    department: {type: String},
    year: {type: Number},
    date: {type: Date},
    content: {type: File},
    exam_name: {type: String}
});

module.exports = mongoose.model('Results', resultSchema);
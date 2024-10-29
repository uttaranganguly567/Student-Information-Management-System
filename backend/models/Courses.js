const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    course_id: {type: Number, required: true},
    course_name: {type: String, required: true},
    year: {type: Number},
    published_date: {type: Date},
    credit: {type: Number}
});

module.exports = mongoose.model('Courses', courseSchema);
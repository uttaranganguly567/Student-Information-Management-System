// backend/models/Fees.js
const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    // This creates a direct link to the Student model's _id
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Student', // Tells Mongoose this ID refers to the 'Student' model
        required: true 
    },
    amount: { type: Number, required: true },
    is_paid: { type: Boolean, default: false },
    due_date: { type: Date }
});
// We removed student_name because we can get it from the 'student' ref

module.exports = mongoose.model('Fees', feeSchema);
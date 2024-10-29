const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
    student_id: {type: Number, required: true},
    student_name: {type: String, required: true},
    amount: {type: Number},
    is_paid: {type: Boolean},
    due_date: {type: Date}
});

module.exports = mongoose.model('Fees', feeSchema);
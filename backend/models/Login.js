const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    password: {type: String, required: true},
    role: {type: String}
});

module.exports = mongoose.model('Login', loginSchema);
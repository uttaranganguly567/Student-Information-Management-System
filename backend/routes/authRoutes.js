const express = require('express');
const router = express.Router();

// Route for user login
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Handle login logic here
    res.send('Login endpoint');
});

// Export the router to use in server.js
module.exports = router;

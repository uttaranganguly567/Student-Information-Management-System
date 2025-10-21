// backend/middleware/authMiddleware.js
// --- CREATE THIS NEW FILE ---

const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

const protect = async (req, res, next) => {
  let token;
  
  // Read the JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get the user from the ID in the token
      // and attach them to the request object
      req.user = await User.findById(decoded.userId).select('-password');
      
      next(); // Move on to the next function
    } catch (error) {
      console.error(error);
      res.status(401).json({ msg: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ msg: 'Not authorized, no token' });
  }
};

module.exports = { protect };
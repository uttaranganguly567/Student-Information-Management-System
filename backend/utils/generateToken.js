// backend/utils/generateToken.js
// --- FULL REPLACEABLE CODE ---

const jwt = require('jsonwebtoken');

const generateToken = (res, userId, userRole) => {
  // We sign a new token with the user's ID and role
  // This is how our app will know *who* is logged in and *what* their role is
  const token = jwt.sign(
    { userId, role: userRole }, 
    process.env.JWT_SECRET, // Make sure to add JWT_SECRET to your .env file!
    { expiresIn: '30d' } // Token lasts for 30 days
  );

  // We're sending the token as an httpOnly cookie for security
  // This is safer than using localStorage
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

module.exports = generateToken;
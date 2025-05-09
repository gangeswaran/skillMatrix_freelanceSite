const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // Extract token from Authorization header
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log(" not found ");
    
    return res.status(403).json({ message: 'Access Denied: No token provided' });
  }

  // Verify the token
  jwt.verify(token, "sdfgjnfkfnv", (err, user) => {
    if (err) {
      console.log(err);
      
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user; // Add user data to request
    next();
  });
};

module.exports = verifyToken;

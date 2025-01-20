const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get token from headers
  const token = req.header("x-auth-token");

  // If no token, return error
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId; // Attach userId to the request object
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token is not valid" });
  }
};

module.exports = authMiddleware;

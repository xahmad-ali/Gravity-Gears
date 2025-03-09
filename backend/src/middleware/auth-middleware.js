const jwt = require("jsonwebtoken");
const userModel = require("../models/user-admin-Model");

///////////////////////////////////
// Protect routes - Only logged-in users
const protect = (req, res, next) => {
    const token = req.cookies?.authToken;; // Get token from cookies
    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_TOKEN); // Verify token
      req.user = decoded; // Attach user data to request
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  };

// console.log(process.env.JWT_TOKEN)


///////////////////////////////////
// Admin Middleware - Only Admins
const admin = (req, res, next) => {
  // console.log("User in Admin Middleware:", req.user);  // Debugging line

  if (req.user && req.user.role === "admin") {
      next();
  } else {
      res.status(403).json({ message: "Access denied, not an admin" });
  }
};


module.exports = { protect, admin};
const jwt = require("jsonwebtoken");
const userModel = require("../models/user-admin-Model");

///////////////////////////////////
// Protect routes - Only logged-in users
const protect = async (req, res, next) => {
    let token = req.headers.authorization;
    if (!token || !token.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Not authorized, no token" });
    }
    try {
        token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select("-password");
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, invalid token" });
    }
};

///////////////////////////////////
// Admin Middleware - Only Admins
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Access denied, not an admin" });
    }
};

module.exports = { protect, admin};
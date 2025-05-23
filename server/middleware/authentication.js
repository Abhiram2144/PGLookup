
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
// when user account is created we create a token with this secret key so we verify it now
const secret_key = process.env.JWT_SECRET_KEY;

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: You do not have access to this resource.",
      });
    }
    next();
  };
};

const checkAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized Access: No token" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ success: false, message: "Unauthorized Access: Invalid token" });
    }
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized Access: User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ success: false, message: "Unauthorized Access: Token error" });
  }
};


module.exports = {checkAuth, authorizeRoles};
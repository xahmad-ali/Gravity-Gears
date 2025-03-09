const userModel = require('../models/user-admin-Model');
const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jsonWebToken");

/////////////////////////////////////////////
/////// registerUser
const regiesterUser = async (req, res) => {
    try {
      /// decomposing data
      let { fullName, email, password, contact } = req.body;
      // Prevent users from assigning themselves as admin
      if (role === "admin") {
        return res.status(403).send("You cannot register as an admin");
      }
      /// chechk if any data is null
      if (!fullName || !email || !password || !contact) {
        return res.status(204).send("All fields are required");
      }
      /// chechk if existed
      let user = await userModel.findOne({ email: email });
      if (user) {
        return res.status(401).send("User already existed");
      } // if does not exist
      else {
        bcrypt.genSalt(10, function (err, salt) {
          if (err) {
            return res.status(500).res("try again later");
          }
          bcrypt.hash(password, salt, async function (err, hash) {
            //creating new user
            let createdUser = await userModel.create({
              fullName,
              email,
              password: hash,
              contact,
            });
            // generating token
            let token = generateToken(createdUser);
            res.cookie("token", token);
  
            res.status(200).send("user Created successfuly");
          });
        });
      }
    } catch (error) {
      res.send(error.message);
    }
  };


////////////////////////////////////////////////////
  // Login User
  const loginUser = async (req, res) => {
    try {
      const { fullName, email, password } = req.body;
  
      // Find user by email
      const user = await userModel.findOne({ email });
      if (!user) return res.status(401).json({ message: "Invalid email or password" });
  
      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
  
      // Generate JWT token
      const token = generateToken(user._id, user.role);
  
      // Set HTTP-only cookie
      res.cookie("authToken", token, {
        httpOnly: true, // Prevents JavaScript access
        secure: true, // Ensures it's sent over HTTPS (enable in production)
        sameSite: "Strict", // Prevents CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000, // Expires in 7 days
      });
  
      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };


/////////////////////////////////////
//// log out /////////////////////
const logoutUser = (req, res) => {
  res.cookie("authToken", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
};


/////////////////////////////////////
// Get User Profile
const getUserProfile = async (req, res) => {
  res.json(req.user);
};


module.exports = {regiesterUser, loginUser, getUserProfile, logoutUser };
const express = require('express');
const router  = express.Router();
const {regiesterUser, loginUser, getUserProfile, logoutUser} = require("../controllers/userContorllers");
const {protect} = require("../middleware/auth-middleware");


router.post("/register",regiesterUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;


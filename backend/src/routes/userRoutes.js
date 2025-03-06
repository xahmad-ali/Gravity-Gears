const express = require('express');
const router  = express.Router();
const {regiesterUser, loginUser, getUserProfile} = require("../controllers/userContorllers");
const {protect} = require("../middleware/auth-middleware");


router.post("/register",regiesterUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

module.exports = router;


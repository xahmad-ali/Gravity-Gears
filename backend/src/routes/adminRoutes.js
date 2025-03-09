const express = require("express");
const router  = express.Router();
const { protect, admin } = require("../middleware/auth-middleware");
const { getAllUsers, deleteUser } = require("../controllers/adminController");


router.get("/get-all-users", protect, admin, getAllUsers);
router.delete("/user/:id", protect, admin, deleteUser);


module.exports = router;
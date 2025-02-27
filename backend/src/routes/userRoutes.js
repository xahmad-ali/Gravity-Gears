const express = require('express');
const router  = express.Router();
const {regiesterUser} = require("../controllers/userContorllers")

router.post("/register",regiesterUser)

module.exports = router;
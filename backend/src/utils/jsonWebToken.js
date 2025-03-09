require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_TOKEN, { expiresIn: "30d" });
};

module.exports = {generateToken};

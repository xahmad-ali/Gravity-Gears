const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contact: { type: String, required: true},
    role: { type: String, enum: ["user", "admin"], default: "user" }, // Default user, admin for admins
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;

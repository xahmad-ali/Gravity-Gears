const userModel = require("../models/user-admin-Model");

///////////////////////////////////
// Get All Users (Only Admin)
const getAllUsers = async (req, res) => {
    const users = await userModel.find({});
    res.json(users);
};

//////////////////////////////////////
// Delete User (Only Admin)
const deleteUser = async (req, res) => {
    const user = await userModel.findById(req.params.id);
    if (user) {
        await user.remove();
        res.json({ message: "User removed" });
    } else {
        res.status(404).json({ message: "User not found" });
    }
};


module.exports = { getAllUsers, deleteUser };
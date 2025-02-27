const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config({
    path: "../.env",
});

const MONGO_URI = process.env.MONGODB_URL; // ✅ Fix: Use process.env instead of config.get()

if (!MONGO_URI) {
    console.error(" MONGODB_URL is not defined in .env file");
    process.exit(1); // Exit process if no DB URL is found
}

mongoose
    .connect(MONGO_URI, {
    })
    .then(() => {
        console.log("Database Connected Successfully");
    })
    .catch((err) => {
        console.error(" Database Connection Failed");
        console.error(err);
        process.exit(1);
    });

module.exports = mongoose.connection;

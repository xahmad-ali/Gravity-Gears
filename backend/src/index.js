const dotenv = require("dotenv")
dotenv.config({
    path: '../.env'
});
console.log("PORT:", process.env.PORT);

const db = require("../src/config/db-Config.js")
const cloudinary = require("./config/cloudinaryConfig.js")
const app = require("./app.js");
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
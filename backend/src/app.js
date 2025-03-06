const express = require("express");
const app = express();
const path = require("path");
const usersRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");


app.use(express.json());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("hi Ahmad");
});


app.use("/api/v1/users",usersRoutes);
app.use("/api/v1/admin",adminRoutes);
app.use("/api/v1/products", productRoutes);

module.exports = app;

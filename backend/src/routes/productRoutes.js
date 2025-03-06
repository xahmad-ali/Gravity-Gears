const express = require('express');
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct  } = require('../controllers/productController');
const { admin, protect } = require("../middleware/auth-middleware")
const router  = express.Router();


router.get("/", getAllProducts);
router.get("/:id", getProductById);

router.post("/create", protect, admin, createProduct);  // Admin Only
router.put("/update/:id", protect, admin,updateProduct); // Admin Only
router.delete("/delete/:id", protect, admin, deleteProduct); // Admin Only


module.exports = router;
const express = require('express');
const { getAllProducts, createProduct, updateProduct  } = require('../controllers/productController');
const router  = express.Router();

router.get("/",getAllProducts)

router.post("/", createProduct);  // Admin Only
router.put("/:id", updateProduct); // Admin Only
// router.delete("/:id", deleteProduct); // Admin Only


module.exports = router;
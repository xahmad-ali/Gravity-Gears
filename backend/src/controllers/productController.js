const product = require("../models/products-Model")
const sendResponse = require("../utils/responseHandler")

const getAllProducts = async(req, res)=>{
    try {
        const products = await product.find()
        sendResponse(res, 200, true, products, "Products fetched successfully");
    } catch (error) {
        sendResponse(res, 500, false, null, "Server Error");
    }
};

///////////////////////////////////////////////////////
// ✅ Get a single product by ID
const getProductById = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ message: "Server Error" });
    }
  };
  
///////////////////////////////////////////////////////
// ✅ Create a new product (Admin Only)
const createProduct = async (req, res) => {
    try {
      const { name, image, description, category, price, discount, countInStock } = req.body;
  
      const product = new Product({
        name,
        image,
        description,
        category,
        price,
        discount,
        countInStock,
      });
  
      const savedProduct = await product.save();
      sendResponse(res, 201, true, savedProduct, "Product created successfully");
    } catch (error) {
      sendResponse(res, 500, false, null, "Error creating product");
    }
  };

///////////////////////////////////////////////////////////
// ✅ Update a product (Admin Only)
const updateProduct = async (req, res) => {
    try {
      const { name, image, description, category, price, discount, countInStock } = req.body;
  
      const product = await Product.findById(req.params.id);
      if (!product) {
        return sendResponse(res, 404, false, null, "Product not found");
      }
      product.name = name || product.name;
      product.image = image || product.image;
      product.description = description || product.description;
      product.category = category || product.category;
      product.price = price || product.price;
      product.discount = discount || product.discount;
      product.countInStock = countInStock || product.countInStock;
  
      const updatedProduct = await product.save();
      sendResponse(res, 200, true, updatedProduct, "Product updated successfully");
    } catch (error) {
      sendResponse(res, 500, false, null, "Error updating product");
    }
  };

////////////////////////////////////////////
// ✅ Delete a product (Admin Only)
const deleteProduct = async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      await product.deleteOne();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  };



module.exports = { getAllProducts, createProduct, updateProduct, deleteProduct };
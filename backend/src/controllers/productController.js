const productModel = require("../models/products-Model")
const sendResponse = require("../utils/responseHandler")

///////////////////////////////////////////////////////
//////// Get all Products ///////
const getAllProducts = async(req, res)=>{
    try {
        const products = await productModel.find()
        sendResponse(res, 200, true, products, "Products fetched successfully");
    } catch (error) {
        sendResponse(res, 500, false, null, "Server Error");
    }
};

///////////////////////////////////////////////////////
// ✅ Get a single product by ID
const getProductById = async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);
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
      const { 
          name, 
          coverImage, 
          image, 
          description, 
          category, 
          brand, 
          price, 
          discount, 
          countInStock, 
          warranty, 
          specifications 
      } = req.body;

      // Validation: Ensure coverImage exists
      if (!coverImage) {
          return sendResponse(res, 400, false, null, "Cover image is required.");
      }

      // Validation: Ensure max 5 images
      // if (image && image.length > 5) {
      //     return sendResponse(res, 400, false, null, "You can upload a maximum of 5 images.");
      // }

      const product = new productModel({
          name,
          coverImage,
          image: image || [], // Default empty array if not provided
          description,
          category,
          brand: brand || "Unknown", // Default value
          price,
          discount,
          countInStock,
          warranty: warranty || "No Warranty", // Default value
          specifications: specifications || {}, // Default value
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
      const { 
        name, 
        coverImage, 
        image, 
        description, 
        category, 
        brand, 
        price, 
        discount, 
        countInStock, 
        warranty, 
        specifications 
       } = req.body;
  
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return sendResponse(res, 404, false, null, "Product not found");
      }

      // Update fields only if provided
      product.name = name || product.name;
      product.coverImage = coverImage || product.coverImage;
      product.image = image || product.image;
      product.description = description || product.description;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.price = price || product.price;
      product.discount = discount || product.discount;
      product.countInStock = countInStock || product.countInStock;
      product.warranty = warranty || product.warranty;
      product.specifications = specifications || product.specifications;
  
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
      const product = await productModel.findById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      await product.deleteOne();
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting product" });
    }
  };



module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
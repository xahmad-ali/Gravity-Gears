const { cloudinary } = require("../config/cloudinaryConfig");
const productModel = require("../models/products-Model");
const { sendResponse } = require("../utils/responseHandler");

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
      description, 
      category, 
      brand, 
      price, 
      discount, 
      countInStock, 
      warranty, 
      specifications 
    } = req.body;

    // Ensure a file was uploaded
    if (!req.files || !req.files["coverImage"]) {
      return sendResponse(res, 400, false, null, "Cover image is required.");
    }

    // Upload cover image to Cloudinary
    const coverImageBuffer = req.files["coverImage"][0].buffer;
    const coverImageResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(coverImageBuffer);
    });

    // Upload additional images (if provided)
    let imageUrls = [];
    if (req.files["image"]) {
      if (req.files["image"].length > 5) {
        return sendResponse(res, 400, false, null, "You can upload a maximum of 5 images.");
      }

      // Loop through images and upload to Cloudinary
      for (let file of req.files["image"]) {
        const imageUploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }).end(file.buffer);
        });
        imageUrls.push(imageUploadResult.secure_url);
      }
    }

    // Create new product
    const product = new productModel({
      name,
      coverImage: coverImageResult.secure_url, // Cloudinary URL
      image: imageUrls, // Additional images
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
    const updatedProduct = await productModel.findByIdAndUpdate(
      req.params.id,
      { $set: req.body }, // Update only the provided fields
      { new: true, runValidators: true } // Return updated product & run validation
    );

    if (!updatedProduct) {
      return sendResponse(res, 404, false, null, "Product not found");
    }

    sendResponse(res, 200, true, updatedProduct, "Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    sendResponse(res, 500, false, null, "Error updating product");
  }
};


/////////////////////////////////////////////
//////////// UpdateCover Image ///////////
const updateCoverImage = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return sendResponse(res, 404, false, null, "Product not found");

    // Ensure an image is uploaded
    if (!req.file) {
      return sendResponse(res, 400, false, null, "Cover image is required.");
    }

    // 🛑 Extract Public ID from the existing cover image URL
    if (product.coverImage) {
      const oldImagePublicId = product.coverImage.split("/").pop().split(".")[0]; // Extract public_id
      await cloudinary.uploader.destroy(`products/${oldImagePublicId}`); // Delete old image
    }

    // ✅ Upload new cover image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "products" }, (error, uploadResult) => {
        if (error) reject(error);
        else resolve(uploadResult);
      }).end(req.file.buffer);
    });

    // ✅ Update cover image in DB
    product.coverImage = result.secure_url;
    const updatedProduct = await product.save();

    sendResponse(res, 200, true, updatedProduct, "Cover image updated successfully");

  } catch (error) {
    sendResponse(res, 500, false, null, "Error updating cover image");
  }
};



//////////////////////////////////////////////
/////////// Update Additional Images ONly /////
const updateProductImages = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) return sendResponse(res, 404, false, null, "Product not found");

    // Ensure images are uploaded
    if (!req.files || req.files.length === 0) {
      return sendResponse(res, 400, false, null, "At least one image is required.");
    }

    // Ensure max 5 images
    if (req.files.length > 5) {
      return sendResponse(res, 400, false, null, "You can upload a maximum of 5 images.");
    }

    // Delete previous images from Cloudinary
    if (product.image && product.image.length > 0) {
      for (let imgUrl of product.image) {
        // Extract public_id from image URL
        const publicId = imgUrl.split("/").pop().split(".")[0]; 
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    // Upload new images to Cloudinary
    let imageUrls = [];
    for (let file of req.files) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }).end(file.buffer);
      });
      imageUrls.push(uploadResult);
    }

    // Update product images in DB
    product.image = imageUrls;
    const updatedProduct = await product.save();
    sendResponse(res, 200, true, updatedProduct, "Product images updated successfully");

  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, null, "Error updating product images");
  }
};


////////////////////////////////////////////
// ✅ Delete a product (Admin Only)
const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    if (!product) {
      return sendResponse(res, 404, false, null, "Product not found");
    }

    // Delete coverImage from Cloudinary if exists
    if (product.coverImage) {
      const coverImageId = product.coverImage.split("/").pop().split(".")[0]; 
      await cloudinary.uploader.destroy(`products/${coverImageId}`);
    }

    // Delete all images from Cloudinary if exist
    if (product.image && product.image.length > 0) {
      for (let imgUrl of product.image) {
        const publicId = imgUrl.split("/").pop().split(".")[0]; 
        await cloudinary.uploader.destroy(`products/${publicId}`);
      }
    }

    // Delete product from database
    await product.deleteOne();
    sendResponse(res, 200, true, null, "Product deleted successfully");

  } catch (error) {
    console.error(error);
    sendResponse(res, 500, false, null, "Error deleting product");
  }
};




module.exports = { 
  getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, updateCoverImage, 
  updateProductImages };
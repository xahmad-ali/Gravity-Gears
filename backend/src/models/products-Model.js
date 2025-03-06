const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    coverImage: { type: String, required: true }, // Main product image
    image: { type: [String] }, // URL of product image
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Watches", "Buds"
    brand: { type: String }, // Optional: If you want to show a brand name
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 }, // Available quantity
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    warranty: { type: String, default: "No Warranty" }, // e.g., "1 Year", "6 Months"
    specifications: { type: Object, default: {} }, // Additional specs like battery life, connectivity, etc.

  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

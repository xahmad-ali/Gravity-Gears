const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL of product image
    description: { type: String, required: true },
    category: { type: String, required: true }, // e.g., "Watches", "Buds"
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    countInStock: { type: Number, required: true, default: 0 }, // Available quantity
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

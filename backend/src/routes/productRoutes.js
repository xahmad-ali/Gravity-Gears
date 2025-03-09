const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateCoverImage,
  updateProductImages,
} = require("../controllers/productController");
const { admin, protect } = require("../middleware/auth-middleware");
const { upload } = require("../middleware/multer");

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);

// FIX: Support multiple images (coverImage + additional images)
router.post(
  "/create-product",
  protect,
  admin,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "image", maxCount: 5 },
  ]),
  createProduct
);

router.put("/update-product/:id", protect, admin, updateProduct); // Admin Only

router.put(
  "/update-product/:id/coverImage",
  protect,
  admin,
  upload.single("coverImage"),
  updateCoverImage
); // Admin Only

router.put(
  "/update-product/:id/image",
  protect,
  admin,
  upload.array("image", 5),
  updateProductImages
); // Admin Only

router.delete("/delete-product/:id", protect, admin, deleteProduct); // Admin Only

module.exports = router;

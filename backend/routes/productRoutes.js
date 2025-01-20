// routes/productRoutes.js
const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/authMiddleware");

router.post(
  "/products",
  upload.single("image"),
  productController.createProduct
); // Create a new product
router.get("/products", productController.getProducts); // Get all products
router.get("/products/:id", productController.getProductById);
router.put("/products/:id", productController.updateProduct); // Update product by ID
router.delete("/products/:id", productController.deleteProduct); // Delete product by ID

module.exports = router;

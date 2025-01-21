const Product = require("../models/product");
const Joi = require("joi");
const cloudinary = require("../config/cloudinary");

// Validation schema using Joi
const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  imageUrl: Joi.string().optional(),
});

exports.createProduct = async (req, res) => {
  try {
    let imageUrl = null;

    // Upload the image if provided
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              reject(error);
            } else {
              console.log("Cloudinary Upload Success:", result.secure_url);
              resolve(result);
            }
          }
        );
        stream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    // Create the product with image URL
    const product = new Product({
      ...req.body,
      imageUrl: imageUrl,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server error");
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).send(`Server error: ${err.message}`);
  }
};

// Get a product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.status(200).json(product);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  const { error } = productSchema.validate(req.body); // Joi validation
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).send("Product not found");
    res.status(200).json(product);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).send("Product not found");
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).send("Server error");
  }
};

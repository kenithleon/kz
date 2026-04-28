const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= GET ALL PRODUCTS =================
router.get("/", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    console.error("GET PRODUCTS ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CREATE PRODUCT =================
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      countInStock,
      sku,
      category,
      brand,
      material,
      gender,
      collection,
      sizes,
      colors,
      images,
    } = req.body;

    // ✅ VALIDATION
    if (!name || !description || !price || !sku) {
      return res.status(400).json({
        message: "Name, description, price and SKU are required",
      });
    }

    // ✅ CHECK SKU UNIQUE
    const existingProduct = await Product.findOne({ sku });
    if (existingProduct) {
      return res.status(400).json({
        message: "Product with this SKU already exists",
      });
    }

    // ✅ CREATE PRODUCT
    const product = new Product({
      name,
      description,
      price,
      countInStock: countInStock || 0,
      sku,
      category,
      brand,
      material,
      gender,
      collection,
      sizes: sizes || [],
      colors: colors || [],
      images: images || [],
      user: req.user?._id,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
    });
  }
});

// ================= UPDATE PRODUCT =================
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ UPDATE FIELDS
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;

    // 🔥 IMPORTANT (handles 0 correctly)
    product.countInStock =
      req.body.countInStock ?? product.countInStock;

    product.sku = req.body.sku || product.sku;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.material = req.body.material || product.material;
    product.gender = req.body.gender || product.gender;
    product.collection = req.body.collection || product.collection;

    product.sizes = req.body.sizes || product.sizes;
    product.colors = req.body.colors || product.colors;

    // 🔥 FINAL FIX → SYNC IMAGES (ADD + DELETE WORKS)
    if (req.body.images) {
      product.images = req.body.images;
    }

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
});

// ================= DELETE PRODUCT =================
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
});

module.exports = router;
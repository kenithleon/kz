const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route   POST /api/products
// @desc    Create a new product
// @access  Private
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// @route PUT/api/product/:id
// upadte an existing product
// access private/admim

router.put("/:id", protect, admin, async (req, res) => {
  try{
     const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collection,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    // find product by id

    const product = await Product.findById(req.params.id);
    if(product){
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collection = collection || product.collection;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
       product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimensions = dimensions || product.dimensions;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;


      //save the upadated product

      const updatedProduct = await  product.save();
      res.json(updatedProduct);
      
    } else {
      res.status(404).json({message: "Product not found"});
      
    }

  } catch (error){
    console.error(error);
    res.status(500).send("server Error")

  }
})

//delete
//private/admin

router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if(product) {
      await product.deleteOne();
      res.json({message: "Product removed"});

    } else {
      res.status(404).json({message: "Product not found"});
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error")
  }
})


// @route GET/api/products
//access public

router.get("/", async (req, res) => {
  try {
    const {collection, size, color, gender, minPrice, maxPrice, sortBy,
    search, category, material, brand, limit,
    } = req.query;

    let query = {};

    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collection= collection;
    }

     if (category && category.toLocaleLowerCase() !== "all") {
      query.category= category;
    }
    if(material) {
      query.material = { $in: material.split(",") };
    }
     if(brand) {
      query.brand = { $in: brand.split(",") };
    }
     if(size) {
      query.size = { $in: size.split(",") };
    }
     if(color) {
      query.color = { $in: [color] };
    }
    if (gender) {
      query.gender = gender;
    }
    if (minPrice || maxPrice) {
      query.price ={};
      if(minPrice) query.price.$gte = Number(minPrice);
      if(maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search){
      query.$or = [
        {name: {$regex: search, $options: "i"}},
        {description: {$regex: search, $options: "i"}},
      ];
    }

    // sort logic
    let sort ={};
    if(sortBy) {
      switch (sortBy) {
        case "priceAsc" : 
        sort = { price: 1};
        break;
        case "priceDesc":
        sort = { price: -1};
        break;
        case "popularity" :
        sort ={ rating: -1};
        break;
        default:
        break;
      }
    }

    //Fetch products and apply sorting and limit

    let products = await Product.find(query)
    .sort(sort)
    .limit(Number(limit) || 0);
    res.json(products);


    } catch (error) {
      console.error(error);
      res.status(500).send("server error");
    }
});

router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1});
    if(bestSeller) {
      res.json(bestSeller);

    } else {
      res.status(404).json({message: "No best seller found"});
    }
  } catch (error)  {
    console.error(error);
    res.status(500).send("Server Error")
  }
});

//route get/api/products/new-arrivals
//access/public

router.get("/new-arrivals", async (req, res) => {
  try {
    const newArrivals = await Product.find()
    .sort({ createdAt: -1}).limit(8);
    res.json(newArrivals);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

// ================= GET PRODUCT BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// ================= SIMILAR PRODUCTS =================
router.get("/similar/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let similarProducts = await Product.find({
      _id: { $ne: product._id },
      gender: product.gender,
      category: product.category,
      isPublished: true,
    }).limit(4);

    // ✅ fallback if empty
    if (similarProducts.length === 0) {
      similarProducts = await Product.find({
        _id: { $ne: product._id },
      }).limit(4);
    }

    res.json(similarProducts);

  } catch (error) {
    console.error("SIMILAR ERROR:", error.message);
    res.status(500).send("Server Error");
  }
});


//route get/api/products/best-seler
//acces/public


module.exports = router;

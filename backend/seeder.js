const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart")
const products = require("./data/products");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();
    await Cart.deleteMany();

    // Create admin user
    const createdUser = await User.create({
      name: "Admin User",
      email: "admin@gmail.com",
      password: "123456", // should be hashed via pre-save
      isAdmin: true,
    });

    const userID = createdUser._id;

    // Attach admin user to products
    const sampleProducts = products.map((product) => {
      return { ...product, user: userID };
    });

    // Insert products
    await Product.insertMany(sampleProducts);

    console.log("✅ Product data seeded successfully");
    process.exit();

  } catch (error) {
    console.error("❌ Error seeding the data", error);
    process.exit(1);
  }
};

seedData();

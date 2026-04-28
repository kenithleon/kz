const express = require("express");
const cors = require("cors");

// load env only in local
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const connectDB = require("./config/db");

// routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscribeRoute = require("./routes/subscribeRoute");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const paypalRoutes = require("./routes/paypalRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// ✅ DB connection middleware (important for Vercel)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB ERROR:", err.message);
    return res.status(500).json({ error: "Database connection failed" });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("WELCOME TO KICKLESS ZONE 🚀");
});

// api routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/subscribe", subscribeRoute);
app.use("/api/paypal", paypalRoutes);
app.use("/api/razorpay", razorpayRoutes);

// admin routes
app.use("/api/admin", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

// ❌ DO NOT USE app.listen()

// ✅ export for Vercel
const serverless = require("serverless-http");
module.exports = serverless(app);
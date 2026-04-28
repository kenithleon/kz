const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');

// routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const subscribeRoute = require('./routes/subscribeRoute');
const adminRoutes = require('./routes/adminRoutes');
const productAdminRoutes = require('./routes/productAdminRoutes');
const adminOrderRoutes = require('./routes/adminOrderRoutes');
const paypalRoutes = require('./routes/paypalRoutes'); // ✅ FIXED
const razorpayRoutes = require("./routes/razorpayRoutes");

dotenv.config();

const app = express();

// middleware
app.use(express.json());
app.use(cors());

// database
connectDB();

// test route
app.get('/', (req, res) => {
  res.send('WELCOME TO KICKLESS ZONE');
});

// api routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/subscribe', subscribeRoute);
app.use('/api/paypal', paypalRoutes); // ✅ WORKS NOW
app.use("/api/razorpay", razorpayRoutes);

// admin
app.use('/api/admin', adminRoutes);
app.use('/api/admin/products', productAdminRoutes);
app.use('/api/admin/orders', adminOrderRoutes);

// server
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
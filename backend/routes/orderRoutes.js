const express = require("express");
const mongoose = require("mongoose");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();


// ================= GET MY ORDERS =================
router.get("/my-orders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error("GET MY ORDERS ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= GET ORDER BY ID =================
router.get("/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Ownership check
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);

  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ================= (OPTIONAL) CAPTURE PAYPAL PAYMENT =================
// ⚠️ Use ONLY if you switch from checkout flow to direct order payment
router.put("/:id/capture", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderID } = req.body;

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Ownership check
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Prevent duplicate payment
    if (order.isPaid) {
      return res.status(400).json({ message: "Order already paid" });
    }

    // ✅ Validate PayPal order ID
    if (!orderID) {
      return res.status(400).json({ message: "Missing PayPal orderID" });
    }

    // ✅ Mark as paid
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentMethod = "PayPal";

    order.paymentResult = {
      id: orderID,
      status: "COMPLETED",
      update_time: new Date().toISOString(),
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);

  } catch (error) {
    console.error("CAPTURE ERROR:", error);
    res.status(500).json({
      message: "Payment capture failed",
      error: error.message,
    });
  }
});


module.exports = router;
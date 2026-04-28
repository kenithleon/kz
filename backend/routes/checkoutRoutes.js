const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Checkout = require("../models/Checkout");
const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product"); // ✅ IMPORTANT
const { protect } = require("../middleware/authMiddleware");


// ======================================
// CREATE CHECKOUT
// ======================================
router.post("/", protect, async (req, res) => {
  try {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!Array.isArray(checkoutItems) || checkoutItems.length === 0) {
      return res.status(400).json({ message: "Checkout items are required" });
    }

    const newCheckout = await Checkout.create({
      user: req.user._id,
      checkoutItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      paymentStatus: "pending",
      isPaid: false,
      isFinalized: false,
    });

    res.status(201).json(newCheckout);

  } catch (error) {
    console.error("CREATE CHECKOUT ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ======================================
// PAY CHECKOUT
// ======================================
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const { paymentStatus, paymentDetails } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid checkout ID" });
    }

    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (!checkout.user.equals(req.user._id)) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (checkout.isPaid) {
      return res.status(400).json({ message: "Already paid" });
    }

    if (paymentStatus !== "paid") {
      return res.status(400).json({ message: "Payment failed" });
    }

    checkout.isPaid = true;
    checkout.paymentStatus = "paid";
    checkout.paymentDetails = paymentDetails || {};
    checkout.paidAt = new Date();

    const updatedCheckout = await checkout.save();

    res.status(200).json(updatedCheckout);

  } catch (error) {
    console.error("PAY ERROR:", error);
    res.status(500).json({ message: "Server Error" });
  }
});


// ======================================
// FINALIZE CHECKOUT → CREATE ORDER
// ======================================
router.post("/:id/finalize", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid checkout ID" });
    }

    const checkout = await Checkout.findById(req.params.id);

    if (!checkout) {
      return res.status(404).json({ message: "Checkout not found" });
    }

    if (!checkout.user.equals(req.user._id)) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!checkout.isPaid) {
      return res.status(400).json({ message: "Checkout not paid yet" });
    }

    if (checkout.isFinalized) {
      return res.status(400).json({ message: "Already finalized" });
    }

    if (!checkout.checkoutItems || checkout.checkoutItems.length === 0) {
      return res.status(400).json({ message: "No items found" });
    }

    // 🔥 FIX: Fetch real product data from DB
    const orderItems = await Promise.all(
      checkout.checkoutItems.map(async (item) => {
        const product = await Product.findById(item.product);

        if (!product) {
          throw new Error("Product not found");
        }

        return {
          productId: product._id,
          name: product.name,
          image: product.images?.[0]?.url || product.image || "", // ✅ FIXED IMAGE
          price: product.price,
          quantity: item.qty || 1, // ✅ FIXED qty
          size: item.size || "",
          color: item.color || ""
        };
      })
    );

    const finalOrder = await Order.create({
      user: checkout.user,
      orderItems,
      shippingAddress: checkout.shippingAddress,
      paymentMethod: checkout.paymentMethod,
      totalPrice: checkout.totalPrice,
      paymentStatus: "Paid",
      status: "Processing",
      isPaid: true,
      paidAt: checkout.paidAt
    });

    checkout.isFinalized = true;
    checkout.finalizedAt = new Date();

    await checkout.save();

    await Cart.deleteOne({ user: checkout.user });

    console.log("FINAL ORDER:", finalOrder); // ✅ DEBUG

    res.status(201).json({
      message: "Order created successfully",
      order: finalOrder
    });

  } catch (error) {
    console.error("FINALIZE ERROR:", error);

    res.status(500).json({
      message: "Server Error",
      error: error.message
    });
  }
});

module.exports = router;
const express = require("express");
const mongoose = require("mongoose");
const User = require("../models/User");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// ================= GET ALL USERS =================
router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users); // ✅ always flat array
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= CREATE USER =================
router.post("/users", protect, admin, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      name,
      email,
      password,
      role: role || "customer",
    });

    await user.save();

    res.status(201).json(user); // ✅ FIXED
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= UPDATE USER =================
router.put("/users/:id", protect, admin, async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "Invalid User ID format" });
  }

  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();

    res.json(updatedUser); // ✅ FIXED
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// ================= DELETE USER =================
router.delete("/users/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.deleteOne();
      res.json({ message: "User deleted" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
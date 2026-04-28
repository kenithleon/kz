const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ------------------ Helper ------------------ */
const getCart = async (userId, guestId) => {
  if (userId) return await Cart.findOne({ user: userId });
  if (guestId) return await Cart.findOne({ guestId });
  return null;
};

/* ------------------ ADD TO CART ------------------ */
router.post("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  let quantity = Number(req.body.quantity);

  try {
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await getCart(userId, guestId);

    if (!cart) {
      cart = new Cart({
        user: userId || undefined,
        guestId: guestId || `guest_${Date.now()}`,
        products: [],
      });
    }

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index > -1) {
      cart.products[index].quantity += quantity;
    } else {
      cart.products.push({
        productId,
        name: product.name,
        image: product.images?.[0]?.url,
        price: product.price,
        size,
        color,
        quantity,
      });
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json(cart); // ✅ always return cart
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------------ UPDATE QUANTITY ------------------ */
router.put("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;
  const quantity = Number(req.body.quantity);

  try {
    if (isNaN(quantity)) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    if (quantity > 0) {
      cart.products[index].quantity = quantity;
    } else {
      cart.products.splice(index, 1);
    }

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json(cart); // ✅ FIX
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------------ REMOVE FROM CART ------------------ */
router.delete("/", async (req, res) => {
  const { productId, size, color, guestId, userId } = req.body;

  try {
    let cart = await getCart(userId, guestId);
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const index = cart.products.findIndex(
      (p) =>
        p.productId.toString() === productId &&
        p.size === size &&
        p.color === color
    );

    if (index === -1) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.products.splice(index, 1);

    cart.totalPrice = cart.products.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json(cart); // ✅ FIXED (was Cart ❌)
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------------ GET CART ------------------ */
router.get("/", async (req, res) => {
  const { userId, guestId } = req.query;

  try {
    const cart = await getCart(userId, guestId);

    if (cart) {
      return res.json(cart);
    }

    // ✅ ALWAYS return same structure
    return res.json({ products: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

/* ------------------ MERGE CART ------------------ */
router.post("/merge", protect, async (req, res) => {
  const { guestId } = req.body;

  try {
    const guestCart = await Cart.findOne({ guestId });
    const userCart = await Cart.findOne({ user: req.user._id });

    if (guestCart && guestCart.products.length > 0) {
      if (userCart) {
        guestCart.products.forEach((guestItem) => {
          const index = userCart.products.findIndex(
            (item) =>
              item.productId.toString() === guestItem.productId.toString() &&
              item.size === guestItem.size &&
              item.color === guestItem.color
          );

          if (index > -1) {
            userCart.products[index].quantity += guestItem.quantity;
          } else {
            userCart.products.push({ ...guestItem.toObject() });
          }
        });

        userCart.totalPrice = userCart.products.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );

        await userCart.save();
        await Cart.findOneAndDelete({ guestId });

        return res.json(userCart);
      } else {
        guestCart.user = req.user._id;
        guestCart.guestId = undefined;
        await guestCart.save();

        return res.json(guestCart);
      }
    }

    if (userCart) return res.json(userCart);

    return res.json({ products: [] }); // ✅ consistent response
  } catch (error) {
    console.error("Merge error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discountPrice: Number,

    countInStock: {
      type: Number,
      default: 0,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
    },

    category: String,
    brand: String,

    sizes: [String],
    colors: [String],

    collection: String,
    material: String,

    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },

    // ✅ MULTIPLE IMAGES
    images: [
      {
        url: {
          type: String,
          required: true,
        },
        altText: String,
      },
    ],

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isPublished: {
      type: Boolean,
      default: true,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    tags: [String],

   
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    metaTitle: String,
    metaDescription: String,
    metaKeywords: [String],

    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },

    weight: Number,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
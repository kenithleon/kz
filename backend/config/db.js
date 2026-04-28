const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is NOT defined");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    isConnected = true;

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error; // ❌ DO NOT use process.exit
  }
};

module.exports = connectDB;
const express = require("express");
const axios = require("axios");

const router = express.Router();

// ================= ACCESS TOKEN =================
const generateAccessToken = async () => {
  try {
    const response = await axios({
      url: "https://api-m.sandbox.paypal.com/v1/oauth2/token",
      method: "post",
      data: "grant_type=client_credentials",
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.log("❌ TOKEN ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// ================= CREATE ORDER =================
router.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount required" });
    }

    const accessToken = await generateAccessToken();

    const response = await axios.post(
      "https://api-m.sandbox.paypal.com/v2/checkout/orders",
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD", // ✅ IMPORTANT
              value: Number(amount).toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ id: response.data.id });

  } catch (error) {
    console.log("❌ CREATE ERROR:");
    console.log(JSON.stringify(error.response?.data, null, 2));

    res.status(500).json(error.response?.data || { error: "Create failed" });
  }
});

// ================= CAPTURE ORDER =================
router.post("/capture-order/:orderID", async (req, res) => {
  try {
    const { orderID } = req.params;

    const accessToken = await generateAccessToken();

    const response = await axios.post(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log("🔥 CAPTURE ERROR:");
    console.log(JSON.stringify(error.response?.data, null, 2));

    res.status(500).json(error.response?.data || { error: "Capture failed" });
  }
});

module.exports = router;
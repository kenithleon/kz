import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "../Cart/PayPalButton";
import RazorpayButton from "../Cart/RazorpayButton";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout } from "../../../redux/slices/checkoutSlice";
import { clearCart } from "../../../redux/slices/cartSlice";
import axios from "axios";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [checkoutId, setCheckoutId] = useState(null);

  // ✅ NEW: payment method state
  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  // ================= CREATE CHECKOUT =================
  const handleCreateCheckout = async (e) => {
    e.preventDefault();

    try {
      const res = await dispatch(
        createCheckout({
          checkoutItems: cart.products.map((item) => ({
            product: item._id || item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            qty: item.quantity,
            size: item.size,
            color: item.color,
          })),
          shippingAddress,
          paymentMethod: paymentMethod, // ✅ FIXED
          totalPrice: cart.totalPrice,
        })
      );

      if (res.payload?._id) {
        console.log("✅ CHECKOUT CREATED:", res.payload._id);
        setCheckoutId(res.payload._id);
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  // ================= PAYMENT =================
  const handlePaymentSuccess = async (details) => {
    try {
      const token = localStorage.getItem("userToken");

      // ✅ MARK AS PAID
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ FINALIZE ORDER
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ CLEAR CART
      dispatch(clearCart());

      console.log("🎉 PAYMENT SUCCESS + CART CLEARED");

      navigate(`/order-confirmation/${checkoutId}`);
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  if (!cart?.products?.length) return <p>Your cart is empty</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      
      {/* LEFT SIDE */}
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-6">Checkout</h2>

        <form onSubmit={handleCreateCheckout}>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="w-full p-2 border rounded mb-4 bg-gray-100"
          />

          <input
            placeholder="Address"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, address: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />

          <input
            placeholder="City"
            value={shippingAddress.city}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, city: e.target.value })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />

          <input
            placeholder="Postal Code"
            value={shippingAddress.postalCode}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                postalCode: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />

          <input
            placeholder="Country"
            value={shippingAddress.country}
            onChange={(e) =>
              setShippingAddress({
                ...shippingAddress,
                country: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-4"
            required
          />

          {/* STEP 1: CREATE CHECKOUT */}
          {!checkoutId ? (
            <button className="w-full bg-black text-white py-3 rounded">
              Continue to Payment
            </button>
          ) : (
            <>
              {/* STEP 2: SELECT PAYMENT */}
              <div className="mb-4">
                <label className="mr-4">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  <span className="ml-2">PayPal</span>
                </label>

                <label>
                  <input
                    type="radio"
                    value="razorpay"
                    checked={paymentMethod === "razorpay"}
                    onChange={() => setPaymentMethod("razorpay")}
                  />
                  <span className="ml-2">UPI / GPay</span>
                </label>
              </div>

              {/* STEP 3: SHOW PAYMENT BUTTON */}
              {paymentMethod === "paypal" && (
                <PayPalButton
                  amount={cart.totalPrice}
                  orderId={checkoutId}
                  onSuccess={handlePaymentSuccess}
                  onError={() => alert("Payment failed")}
                />
              )}

              {paymentMethod === "razorpay" && (
                <RazorpayButton
                  amount={cart.totalPrice}
                  onSuccess={handlePaymentSuccess}
                />
              )}
            </>
          )}
        </form>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg mb-4">Order Summary</h3>

        {cart.products.map((item, i) => (
          <div key={i} className="flex justify-between py-2 border-b">
            <div className="flex">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-20 mr-4"
              />
              <div>
                <p>{item.name}</p>
              </div>
            </div>
            <p>₹{item.price}</p>
          </div>
        ))}

        <div className="mt-4 border-t pt-4">
          <p className="font-semibold">Total: ₹{cart.totalPrice}</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
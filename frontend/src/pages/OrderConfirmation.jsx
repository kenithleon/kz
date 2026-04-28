import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { clearCart } from "../../redux/slices/cartSlice";

const OrderConfirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ GET ORDER ID FROM URL

  const { checkoutData } = useSelector((state) => state.checkout);

  useEffect(() => {
    // ❗ If no data → redirect safely
    if (!checkoutData || !checkoutData._id) {
      navigate("/my-orders");
      return;
    }

    // ✅ Clear cart ONLY once after success
    dispatch(clearCart());
    localStorage.removeItem("cartItems");

  }, [checkoutData, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt) => {
    if (!createdAt) return "N/A";

    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10);
    return orderDate.toLocaleDateString();
  };

  // ❗ Prevent crash while loading
  if (!checkoutData) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        🎉 Thank you for your order!
      </h1>

      <div className="p-6 rounded-lg border">
        <div className="flex justify-between mb-10">
          <div>
            <h2 className="text-xl font-semibold">
              Order ID: {checkoutData._id || id}
            </h2>

            <p className="text-gray-500">
              Order date:{" "}
              {checkoutData.createdAt
                ? new Date(checkoutData.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
          </div>

          <div>
            <p className="text-emerald-700 text-sm">
              Estimated Delivery:{" "}
              {calculateEstimatedDelivery(checkoutData.createdAt)}
            </p>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mb-10">
          {checkoutData.checkoutItems?.map((item) => (
            <div
              key={item.product}
              className="flex items-center mb-4"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md mr-4"
              />

              <div>
                <h4 className="text-md font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.color || "N/A"} | {item.size || "N/A"}
                </p>
              </div>

              <div className="ml-auto text-right">
                <p className="text-md">${item.price}</p>
                <p className="text-sm text-gray-500">
                  Qty: {item.qty}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-2">Payment</h4>
            <p className="text-gray-600">PayPal</p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-2">Delivery</h4>
            <p className="text-gray-600">
              {checkoutData.shippingAddress?.address || "N/A"}
            </p>
            <p className="text-gray-600">
              {checkoutData.shippingAddress?.city},{" "}
              {checkoutData.shippingAddress?.country}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
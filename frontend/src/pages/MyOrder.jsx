import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../../redux/slices/orderSlice";

const MyOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  // ✅ Loading / Error handling
  if (loading) return <p >Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>

      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Image</th>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Created</th>
              <th className="py-3 px-4">Shipping Address</th>
              <th className="py-3 px-4">Items</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((order) => (
                <tr
                  key={order._id} // ✅ FIXED
                  onClick={() => handleRowClick(order._id)} // ✅ FIXED
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  {/* IMAGE */}
                  <td className="py-2 px-4">
                    <img
                      src={order.orderItems?.[0]?.image || "/placeholder.png"} // ✅ SAFE
                      alt={order.orderItems?.[0]?.name || "product"}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </td>

                  {/* ORDER ID */}
                  <td className="py-2 px-4 font-medium text-gray-900">
                    #{order._id.slice(-6)} {/* ✅ SHORT ID */}
                  </td>

                  {/* DATE */}
                  <td className="py-2 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}{" "}
                    {new Date(order.createdAt).toLocaleTimeString()}
                  </td>

                  {/* ADDRESS */}
                  <td className="py-2 px-4">
                    {order.shippingAddress
                      ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                      : "N/A"}
                  </td>

                  {/* ITEMS */}
                  <td className="py-2 px-4">
                    {order.orderItems?.length || 0}
                  </td>

                  {/* PRICE */}
                  <td className="py-2 px-4">
                    ${order.totalPrice}
                  </td>

                  {/* STATUS */}
                  <td className="py-2 px-4">
                    <span
                      className={`${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      } px-2 py-1 rounded-full text-xs font-medium`}
                    >
                      {order.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-4 px-4 text-center text-gray-500">
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrder;
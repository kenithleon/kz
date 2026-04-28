import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchAdminProducts } from '../../redux/slices/adminProductSlice';
import { fetchAllOrders } from '../../redux/slices/adminOrderSlice';

const AdminHomePage = () => {
  const dispatch = useDispatch();

  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);

  const {
    orders = [],
    totalOrders = 0,
    totalSales = 0,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className='max-w-7xl mx-auto p-6'>
      
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>

      {/* ================= LOADING / ERROR ================= */}
      {productsLoading || ordersLoading ? (
        <p>Loading...</p>
      ) : productsError ? (
        <p className='text-red-500'>
          Error fetching products: {productsError?.message || productsError}
        </p>
      ) : ordersError ? (
        <p className='text-red-500'>
          Error fetching orders: {ordersError?.message || ordersError}
        </p>
      ) : (

        <>
          {/* ================= STATS ================= */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            
            {/* Revenue */}
            <div className='p-4 shadow-md rounded-lg'>
              <h2 className='text-xl font-semibold'>Revenue</h2>
              <p className='text-2xl font-bold'>
                ${Number(totalSales).toFixed(2)}
              </p>
            </div>

            {/* Total Orders */}
            <div className='p-4 shadow-md rounded-lg'>
              <h2 className='text-xl font-semibold'>Total Orders</h2>
              <p className='text-2xl font-bold'>{totalOrders}</p>
              <Link to="/admin/orders" className="text-blue-500 hover:underline">
                Manage Orders
              </Link>
            </div>

            {/* Total Products */}
            <div className='p-4 shadow-md rounded-lg'>
              <h2 className='text-xl font-semibold'>Total Products</h2>
              <p className='text-2xl font-bold'>{products.length}</p>
              <Link to="/admin/products" className="text-blue-500 hover:underline">
                Manage Products
              </Link>
            </div>

          </div>

          {/* ================= RECENT ORDERS ================= */}
          <div className='mt-6'>
            <h2 className='text-2xl font-bold mb-4'>Recent Orders</h2>

            <div className='overflow-x-auto'>
              <table className='min-w-full text-left text-gray-500'>
                
                <thead className='bg-gray-100 text-xs uppercase text-gray-700'>
                  <tr>
                    <th className='py-3 px-4'>Order ID</th>
                    <th className='py-3 px-4'>Customer</th>
                    <th className='py-3 px-4'>Total Price</th>
                    <th className='py-3 px-4'>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {orders.length > 0 ? (
                    orders.slice(0, 5).map((order) => (
                      <tr
                        key={order._id}
                        className='border-b hover:bg-gray-50 cursor-pointer'
                      >
                        <td className='p-4'>
                          #{order._id?.slice(-6)}
                        </td>

                        <td className='p-4'>
                          {order.user?.name || "Unknown"}
                        </td>

                        <td className='p-4'>
                          ${Number(order.totalPrice).toFixed(2)}
                        </td>

                        <td className='p-4'>
                          <span
                            className={`px-2 py-1 rounded text-sm ${
                              order.isPaid
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {order.isPaid ? "Paid" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className='p-4 text-center text-gray-500'>
                        No recent orders found.
                      </td>
                    </tr>
                  )}
                </tbody>

              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
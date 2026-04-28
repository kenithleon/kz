import React from 'react'
import { Link, NavLink } from 'react-router-dom';
import { FaBoxOpen, FaClipboard, FaSignOutAlt, FaStore, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { logout } from "../../../redux/slices/authSlice";
import { clearCart } from "../../../redux/slices/cartSlice"
 

const AdminSlideBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        navigate('/');
    };
  return (
    <div className='p-6'>
        <div className='mb-6'>
            <Link to="/admin" className="text-2xl font-medium">
            KickLess ZONE
            </Link>

        </div>
        <h2 className='text-xl font-medium text-center mb-6'>
            Admin Dashboard

        </h2>
        <nav  className='flex flex-col space-y-2'>
            <NavLink to="/admin/users" className={({isActive}) => isActive ? 
            "bg-gray700 text-white py-3 px-4 rounded flex items-center space-x-2"
             : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>

            <FaUser />
            <span>Users</span>
    </NavLink>

           <NavLink to="/admin/products" className={({isActive}) => isActive ? 
            "bg-gray700 text-white py-3 px-4 rounded flex items-center space-x-2"
             : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>

            <FaBoxOpen />
            <span>Products</span>
    </NavLink>

           <NavLink to="/admin/orders" className={({isActive}) => isActive ? 
            "bg-gray700 text-white py-3 px-4 rounded flex items-center space-x-2"
             : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>

            <FaClipboard />
            <span>Orders</span>
            
    </NavLink>
    <NavLink
  to="/admin/products/create"
  className={({ isActive }) =>
    isActive
      ? "bg-gray700 text-white py-3 px-4 rounded flex items-center space-x-2"
      : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
  }
>
  <FaBoxOpen />
  <span>Add Product</span>
</NavLink>

           <NavLink to="/" className={({isActive}) => isActive ? 
            "bg-gray700 text-white py-3 px-4 rounded flex items-center space-x-2"
             : "text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"}>

            <FaStore />
            <span>Shop</span>
    </NavLink>

           
    
        </nav>

        <div className='mt-6'>
            <button
            onClick={handleLogout}
            className='cursor-pointer w-full text-white font-extrabold bg-red-500 hover:bg-red-600 flex items-center justify-center rounded space-x-2 px-4 py-2'>
    <FaSignOutAlt />
    <span>Logout</span>
    </button>
        </div>
    </div>
  )
}

export default AdminSlideBar
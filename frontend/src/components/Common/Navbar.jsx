import { Link } from 'react-router-dom';
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiBars3BottomRight
} from 'react-icons/hi2';
import SearchBar from './SearchBar';
import CartDrawer from '../Layout/CartDrawer';
import { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);

  // ✅ SAFE SELECTOR (FIX)
  const cartState = useSelector((state) => state.cart || {});
  const cart = cartState.cart || { products: [] };
  const { user } = useSelector((state) => state.auth)

  const cartItemCount =
    cart.products?.reduce((total, product) => total + product.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          KickLess ZONE
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link to="/collections/all?gender=Men" className="text-gray-700 hover:text-black text-sm uppercase">
            Men
          </Link>
          <Link to="/collections/all?gender=Women" className="text-gray-700 hover:text-black text-sm uppercase">
            Women
          </Link>
          <Link to="/collections/all?category=Top Wear" className="text-gray-700 hover:text-black text-sm uppercase">
            Top Wear
          </Link>
          <Link to="/collections/all?category=Bottom Wear" className="text-gray-700 hover:text-black text-sm uppercase">
            Bottom Wear
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
          <Link to="/admin" className="bg-black text-white px-2 py-1 rounded text-sm">
            Admin
          </Link>
)}
          <Link to="/profile">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* Cart */}
          <button onClick={toggleCartDrawer} className="relative">
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />

            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          <SearchBar />

          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        drawerOpen={drawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-700" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4 ">Menu</h2>

          <nav className="space-y-4 flex flex-col font-bold">
            <Link to="/collections/all?gender=Men" onClick={toggleNavDrawer}>Men</Link>
            <Link to="/collections/all?gender=Women" onClick={toggleNavDrawer}>Women</Link>
            <Link to="/collections/all?category=Top Wear" onClick={toggleNavDrawer}>Top Wear</Link>
            <Link to="/collections/all?category=Bottom Wear" onClick={toggleNavDrawer}>Bottom Wear</Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
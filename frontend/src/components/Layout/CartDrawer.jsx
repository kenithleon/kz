import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();

  // Redux state
  const { user, guestId } = useSelector((state) => state.auth || {});
  const { cart } = useSelector((state) => state.cart || {});

  const userId = user ? user._id : null;

  // ✅ SUPPORT BOTH structures (products OR cartItems)
  const products = cart?.products || cart?.cartItems || [];

  const hasItems = products.length > 0;

  const handleCheckout = () => {
    toggleCartDrawer();

    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  // Debug (optional)
  console.log("Cart Data:", cart);

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[400px] h-full bg-white shadow-lg
      transform transition-transform duration-300 flex flex-col z-50
      ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Close Button */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-700" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Your Cart</h2>

        {hasItems ? (
          <CartContents
            cart={cart}
            userId={userId}
            guestId={guestId}
          />
        ) : (
          <p className="text-gray-500 text-center mt-10">
            Your cart is empty.
          </p>
        )}
      </div>

      {/* Checkout Section */}
      <div className="p-4 bg-white border-t">
        {hasItems && (
          <>
            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
            >
              Checkout
            </button>

            <p className="text-sm text-gray-500 mt-2 text-center">
              Shipping, taxes, and discounts calculated at checkout.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
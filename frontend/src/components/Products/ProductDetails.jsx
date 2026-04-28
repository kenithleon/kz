import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";

import { fetchProductDetails, fetchSimilarProducts } 
from "../../../redux/slices/productsSlice";

import { addToCart } from "../../../redux/slices/cartSlice";
import ProductGrid from "../Products/ProductGrid";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { selectedProduct, loading, error, similarProducts } =
    useSelector((state) => state.products);

  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [productFetchId, dispatch]);

  // ✅ SAFE IMAGE HANDLING FUNCTION
  const getImage = (img) => {
    if (!img) return "";
    if (typeof img === "string") return img;
    return img.url || img.image || "";
  };

  const displayImage =
    mainImage ||
    getImage(selectedProduct?.images?.[0]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color", { duration: 1000 });
      return;
    }

    setIsButtonDisabled(true);

    dispatch(
  addToCart({
    productId: selectedProduct?._id,
    quantity, // ✅ ADD THIS (CRITICAL FIX)
    size: selectedSize,
    color: selectedColor,
    guestId,
    userId: user?._id,
  })
)
      .then(() => {
        toast.success("Product added to cart!", { duration: 1000 });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!selectedProduct) return <p>No product found</p>;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row">

          {/* Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4 mr-6">
            {selectedProduct?.images?.map((image, index) => (
              <img
                key={index}
                src={getImage(image)}
                alt="product"
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                  mainImage === getImage(image)
                    ? "border-black"
                    : "border-transparent"
                }`}
                onClick={() => setMainImage(getImage(image))}
              />
            ))}
          </div>

          {/* Main Image */}
          <div className="md:w-1/2">
            <div className="m-4">
              {displayImage && (
                <img
                  src={displayImage}
                  alt="Main Product"
                  className="w-full object-cover rounded-lg"
                />
              )}
            </div>

            {/* Mobile thumbnails */}
            <div className="md:hidden flex overflow-x-scroll space-x-4 mb-4">
              {selectedProduct?.images?.map((image, index) => (
                <img
                  key={index}
                  src={getImage(image)}
                  alt="product"
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer"
                  onClick={() => setMainImage(getImage(image))}
                />
              ))}
            </div>
          </div>

          {/* Right side (unchanged) */}
          <div className="md:w-1/2 md:ml-10">
            <h1 className="text-3xl font-semibold mb-2">
              {selectedProduct?.name}
            </h1>

            <p className="text-lg text-gray-400 line-through">
              ${selectedProduct?.originalPrice}
            </p>

            <p className="text-xl mb-2">${selectedProduct?.price}</p>

            <p className="text-gray-600 mb-4">
              {selectedProduct?.description}
            </p>

         {/* Colors */}
<div className="mb-4">
  <p>Color:</p>

  <div className="flex gap-2 mt-2">
    {selectedProduct?.colors?.length > 0 ? (
      selectedProduct.colors.map((color) => (
        <button
          key={color}
          onClick={() => setSelectedColor(color)}
          className={`w-8 h-8 rounded-full border ${
            selectedColor === color
              ? "border-4 border-black"
              : "border-gray-300"
          }`}
          style={{ backgroundColor: color.toLowerCase() }}
        />
      ))
    ) : (
      <p className="text-gray-400 text-sm">No colors available</p>
    )}
  </div>
</div>

            {/* Sizes */}
            <div className="mb-4">
              <p>Size:</p>
              <div className="flex gap-2 mt-2">
                {selectedProduct?.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Button */}
            <div className="mb-4">
              <p>Quantity:</p>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border rounded"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={isButtonDisabled}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
            >
              {isButtonDisabled ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl text-center mb-4">
            You may also like
          </h2>
          <ProductGrid products={similarProducts || []} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
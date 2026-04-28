import { Link } from "react-router-dom";

function ProductGrid({ products = [], loading = false, error = null }) {
  
  // ✅ Loading state
  if (loading) {
    return <p className="text-center py-10">Loading products...</p>;
  }

  // ✅ Error state
  if (error) {
    return (
      <p className="text-center text-red-500 py-10">
        Error loading products: {error}
      </p>
    );
  }

  // ✅ Ensure products is array
  if (!Array.isArray(products)) {
    return (
      <p className="text-center py-10 text-gray-500">
        Invalid product data
      </p>
    );
  }

  // ✅ Empty state (IMPORTANT)
  if (products.length === 0) {
    return (
      <p className="text-center py-10 text-gray-500">
        No products found
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
      {products
        .filter((product) => product && product._id) // ✅ clean filtering
        .map((product) => {
          
          // ✅ safer image handling (covers more backend cases)
          const imageUrl =
            product.images?.[0]?.url ||
            product.image || // fallback if backend sends single image
            "";

          return (
            <Link
              key={product._id}
              to={`/product/${product._id}`}
              className="block"
            >
              <div className="bg-white p-4 rounded-lg hover:shadow-lg transition">
                
                {/* Image */}
                <div className="w-full h-72 mb-4 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name || "Product image"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No image available
                    </span>
                  )}
                </div>

                {/* Name */}
                <h3 className="text-lg font-medium">
                  {product.name || "Unnamed Product"}
                </h3>

                {/* Price */}
                {product.price !== undefined && (
                  <p className="text-gray-600 mt-1">
                    ₹{product.price}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
    </div>
  );
}

export default ProductGrid;
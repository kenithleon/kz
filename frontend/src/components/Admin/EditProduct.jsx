import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateProduct } from "../../../redux/slices/adminProductSlice";
import { fetchProductDetails } from "../../../redux/slices/productsSlice";

const EditProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collection: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false);

  // Fetch product
  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  // Set product data safely
  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        ...selectedProduct,
        images: selectedProduct.images || [],
        sizes: selectedProduct.sizes || [],
        colors: selectedProduct.colors || [],
      });
    }
  }, [selectedProduct]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ FIXED IMAGE UPLOAD
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);

    try {
      setUploading(true);
      const uploadedImages = [];

      for (let file of files) {
        const formData = new FormData();
        formData.append("image", file);

        const { data } = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
          formData
        );

        uploadedImages.push({
          url: data.imageUrl,
          altText: "",
        });
      }

      // ✅ SAFE UPDATE
      setProductData((prev) => ({
        ...prev,
        images: [...(prev.images ?? []), ...uploadedImages],
      }));

      setUploading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setUploading(false);
    }
  };

  // Remove image
  const handleRemoveImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // ✅ FIXED SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      ...productData,
      images: productData.images || [],
    };

    console.log("SENDING DATA:", updatedData); // 🔥 DEBUG

    await dispatch(updateProduct({ id, productData: updatedData }));

    navigate("/admin/products");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Description</label>
          <textarea
            name="description"
            value={productData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={productData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Stock */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">Count In Stock</label>
          <input
            type="number"
            name="countInStock"
            value={productData.countInStock}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* SKU */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">SKU</label>
          <input
            type="text"
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Sizes (comma-separated)
          </label>
          <input
            type="text"
            value={productData.sizes.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((s) => s.trim()),
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Colors */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Colors (comma-separated)
          </label>
          <input
            type="text"
            value={productData.colors.join(", ")}
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((c) => c.trim()),
              })
            }
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Image Upload */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Upload Images
          </label>
          <input type="file" multiple onChange={handleImageUpload} />

          {uploading && <p>Uploading...</p>}

          <div className="flex gap-3 mt-3 flex-wrap">
            {productData.images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={img.url}
                  alt="product"
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Update Product
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
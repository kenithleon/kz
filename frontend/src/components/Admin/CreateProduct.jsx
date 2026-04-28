import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createProduct } from "../../../redux/slices/adminProductSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateProduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
  name: "",
  description: "",
  price: "",
  countInStock: "",
  sku: "",
  category: "",
  brand: "",
  material: "",
  gender: "",
  collection: "",
  sizes: [],
  colors: [],
  images: [],
});

  const [uploading, setUploading] = useState(false);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ MULTIPLE IMAGE UPLOAD
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

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));

      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  // ✅ SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (productData.images.length < 1) {
      alert("Upload at least 1 image");
      return;
    }

    await dispatch(createProduct(productData));
    navigate("/admin/products");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Add Product</h2>

      <form onSubmit={handleSubmit}>
        
        {/* NAME */}
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

        {/* DESCRIPTION */}
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

        {/* PRICE */}
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

        {/* STOCK */}
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


        <div className="mb-4">
  <label className="block font-semibold mb-2">Category</label>
  <select
    name="category"
    value={productData.category}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="">Select Category</option>
    <option value="Top Wear">Top Wear</option>
    <option value="Bottom Wear">Bottom Wear</option>
  </select>
</div>

<div className="mb-4">
  <label className="block font-semibold mb-2">Brand</label>
  <select
    name="brand"
    value={productData.brand}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="">Select Brand</option>
    <option value="Nike">Nike</option>
    <option value="Adidas">Adidas</option>
    <option value="Puma">Puma</option>
    <option value="Reebok">Reebok</option>
  </select>
</div>

<div className="mb-4">
  <label className="block font-semibold mb-2">Material</label>
  <select
    name="material"
    value={productData.material}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="">Select Material</option>
    <option value="Cotton">Cotton</option>
    <option value="Polyester">Polyester</option>
    <option value="Wool">Wool</option>
    <option value="Denim">Denim</option>
  </select>
</div>

<div className="mb-4">
  <label className="block font-semibold mb-2">Gender</label>
  <select
    name="gender"
    value={productData.gender}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  >
    <option value="">Select Gender</option>
    <option value="Men">Men</option>
    <option value="Women">Women</option>
  </select>
</div>

<div className="mb-4">
  <label className="block font-semibold mb-2">Collection</label>
  <input
    type="text"
    name="collection"
    value={productData.collection}
    onChange={handleChange}
    className="w-full p-2 border rounded"
  />
</div>

        {/* SIZES */}
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

        {/* COLORS */}
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

        {/* IMAGE UPLOAD */}
        <div className="mb-4">
          <label className="block font-semibold mb-2">
            Upload Images (multiple)
          </label>
          <input type="file" multiple onChange={handleImageUpload} />

          {uploading && <p>Uploading images...</p>}

          {/* PREVIEW */}
          <div className="flex gap-3 mt-3 flex-wrap">
            {productData.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt="product"
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
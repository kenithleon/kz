import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const FilterSlidebar = () => {
  const [searchParam, setSearchParam] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 0,
    maxPrice: 100,
  });

  const [priceRange, setPriceRange] = useState([0, 100]);

  const categories = ["Top Wear", "Bottom Wear"];
  const colors = [
    "red", "blue", "green", "black", "white",
    "yellow", "pink", "gray", "beige", "navy"
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  const materials = [
    "Cotton", "Polyester", "Wool", "Silk",
    "Denim", "Linen", "viscose", "Fleece"
  ];

  const brands = ["Nike", "Adidas", "Puma", "Reebok", "Under Armour"];
  const genders = ["Men", "Women"];

  // ✅ Sync URL → state
  useEffect(() => {
    const params = Object.fromEntries([...searchParam]);

    setFilters({
      category: params.category || "",
      gender: params.gender || "",
      color: params.colors || "",
      size: params.sizes ? params.sizes.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: params.minPrice || 0,
      maxPrice: params.maxPrice || 10000,
    });

    setPriceRange([0, params.maxPrice || 10000]);
  }, [searchParam]);

  // ✅ Generic handler
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...newFilters[name], value];
      } else {
        newFilters[name] = newFilters[name].filter((item) => item !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // ✅ FIXED color handler (button issue solved)
 const handleColorChange = (color) => {
    const newFilters = { ...filters, color };
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // ✅ FIXED price handler
  const handlePriceChange = (e) => {
    const newPrice = e.target.value;

    const newFilters = {
      ...filters,
      minPrice: 0,
      maxPrice: newPrice,
    };

    setPriceRange([0, newPrice]);
    setFilters(newFilters);
    updateURLParams(newFilters);
  };

  // ✅ Update URL params
   const updateURLParams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
      const value = newFilters[key];

      // 🔥 KEY FIXES HERE
      if (key === "size" && value.length > 0) {
        params.append("sizes", value.join(",")); // ✅ FIX
      } 
      else if (key === "color" && value) {
        params.append("colors", value); // ✅ FIX
      } 
      else if (Array.isArray(value) && value.length > 0) {
        params.append(key, value.join(","));
      } 
      else if (value !== "" && value !== 0) {
        params.append(key, value);
      }
    });

    setSearchParam(params);
    navigate(`?${params.toString()}`);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-medium text-gray-800 mb-4">Filters</h3>

      {/* Category */}
      <div className="mb-6">
        <label className="block mb-2">Category</label>
        {categories.map((category) => (
          <div key={category}>
            <input
              type="radio"
              name="category"
              value={category}
              checked={filters.category === category}
              onChange={handleFilterChange}
            />
            <span className="ml-2">{category}</span>
          </div>
        ))}
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block mb-2">Gender</label>
        {genders.map((gender) => (
          <div key={gender}>
            <input
              type="radio"
              name="gender"
              value={gender}
              checked={filters.gender === gender}
              onChange={handleFilterChange}
            />
            <span className="ml-2">{gender}</span>
          </div>
        ))}
      </div>

      {/* Color */}
      <div className="mb-6">
        <label className="block mb-2">Color</label>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-8 h-8 rounded-full border ${
                filters.color === color ? "ring-2 ring-blue-500" : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="mb-6">
        <label className="block mb-2">Size</label>
        {sizes.map((size) => (
          <div key={size}>
            <input
              type="checkbox"
              name="size"
              value={size}
              checked={filters.size.includes(size)}
              onChange={handleFilterChange}
            />
            <span className="ml-2">{size}</span>
          </div>
        ))}
      </div>

      {/* Material */}
      <div className="mb-6">
        <label className="block mb-2">Material</label>
        {materials.map((material) => (
          <div key={material}>
            <input
              type="checkbox"
              name="material"
              value={material}
              checked={filters.material.includes(material)}
              onChange={handleFilterChange}
            />
            <span className="ml-2">{material}</span>
          </div>
        ))}
      </div>

      {/* Brand */}
      <div className="mb-6">
        <label className="block mb-2">Brand</label>
        {brands.map((brand) => (
          <div key={brand}>
            <input
              type="checkbox"
              name="brand"
              value={brand}
              checked={filters.brand.includes(brand)}
              onChange={handleFilterChange}
            />
            <span className="ml-2">{brand}</span>
          </div>
        ))}
      </div>

      {/* Price */}
      <div className="mb-6">
        <label className="block mb-2">Price Range</label>
        <input
          type="range"
          min={0}
          max={10000}
          value={priceRange[1]}
          onChange={handlePriceChange}
          className="w-full"
        />
        <div className="flex justify-between">
          <span>$0</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default FilterSlidebar;
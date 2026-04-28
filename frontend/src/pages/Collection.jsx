import { useEffect, useState, useRef } from 'react';
import { FaFilter } from 'react-icons/fa';
import FilterSlidebar from '../components/Products/FilterSlidebar';
import SortOptions from '../components/Products/SortOptions';
import ProductGrid from '../components/Products/ProductGrid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByFilters } from '../../redux/slices/productsSlice';
import { useParams, useSearchParams } from 'react-router-dom';

const Collection = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();

  // ✅ Safe Redux destructuring with fallback
  const { products = [], loading = false, error = null } =
    useSelector((state) => state.products || {});

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // ✅ FIX: convert URL search params to object
  const queryParams = Object.fromEntries([...searchParams]);

  // ✅ Fetch products when filters change
  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  // Toggle sidebar
  const toggleSlidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Close sidebar when clicking outside
  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ✅ Debug (remove later)
  console.log("Products:", products);
  console.log("Loading:", loading);
  console.log("Error:", error);

  return (
    <div className="flex flex-col lg:flex-row">
      
      {/* Mobile filter button */}
      <button
        onClick={toggleSlidebar}
        className="lg:hidden border p-2 flex justify-center items-center cursor-pointer"
      >
        <FaFilter className="mr-2" />
        Filters
      </button>

      {/* Filter Sidebar */}
      <div
        ref={sidebarRef}
        className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300
        lg:static lg:translate-x-0`}
      >
        <FilterSlidebar />
      </div>

      {/* Main Content */}
      <div className="grow p-4 w-full">
        <h2 className="text-2xl uppercase mb-4">All Collection</h2>

        {/* Sort Options */}
        <SortOptions />

        {/* Products Section */}
        {loading && <p>Loading products...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {!loading && !error && (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
};

export default Collection;
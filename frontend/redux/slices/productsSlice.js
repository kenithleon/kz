import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ================= FETCH PRODUCTS =================
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters) => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) query.append(key, value);
    });

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
    );

    return response.data;
  }
);

// ================= FETCH PRODUCT DETAILS =================
export const fetchProductDetails = createAsyncThunk(
  "products/fetchDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

// ================= FETCH SIMILAR PRODUCTS =================
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

// ================= SLICE =================
const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],

    loadingProducts: false,
    loadingDetails: false,
    loadingSimilar: false,

    error: null,

    filters: {
      category: "",
      size: "",
      color: "",
      gender: "",
      brand: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      material: "",
      collection: "",
    },
  },

  reducers: {
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },

    clearFilters(state) {
      state.filters = {
        category: "",
        size: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        material: "",
        collection: "",
      };
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= PRODUCTS =================
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loadingProducts = true;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loadingProducts = false;
        state.products = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loadingProducts = false;
        state.error = action.error.message;
      })

      // ================= DETAILS =================
      .addCase(fetchProductDetails.pending, (state) => {
        state.loadingDetails = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedProduct = action.payload;

        // ✅ CLEAR OLD SIMILAR PRODUCTS
        state.similarProducts = [];
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.error = action.error.message;
      })

      // ================= SIMILAR =================
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loadingSimilar = true;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loadingSimilar = false;
        state.similarProducts = Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loadingSimilar = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
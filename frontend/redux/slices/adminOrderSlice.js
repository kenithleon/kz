import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// helper
const getToken = () => localStorage.getItem("userToken");

// ================= FETCH ALL ORDERS =================
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // ✅ FIXED
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// ================= UPDATE ORDER =================
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // ✅ FIXED
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Update failed");
    }
  }
);

// ================= DELETE ORDER =================
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/orders/${id}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`, // ✅ FIXED
          },
        }
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Delete failed");
    }
  }
);

// ================= SLICE =================
const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;

        // handle both formats safely
        const orders = action.payload.orders || action.payload;

        state.orders = orders;
        state.totalOrders = orders.length;

        state.totalSales = orders.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
      })

      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.payload;
      })

      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(
          (o) => o._id === updatedOrder._id
        );

        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
      })

      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter(
          (o) => o._id !== action.payload
        );
      });
  },
});

export default adminOrderSlice.reducer;
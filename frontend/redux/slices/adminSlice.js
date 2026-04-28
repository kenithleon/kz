import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/admin`;

// 🔹 Helper for auth
const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("userToken")}`,
  },
});

// ================= FETCH USERS =================
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/users`, getConfig());
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= ADD USER =================
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(`${BASE_URL}/users`, userData, getConfig());

      // ✅ REFRESH DATA (NO DUPLICATES)
      dispatch(fetchUsers());

      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= UPDATE USER =================
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async ({ id, name, email, role }, { dispatch, rejectWithValue }) => {
    try {
      await axios.put(
        `${BASE_URL}/users/${id}`,
        { name, email, role },
        getConfig()
      );

      // ✅ REFRESH
      dispatch(fetchUsers());

      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= DELETE USER =================
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/users/${id}`, getConfig());

      // ✅ REFRESH
      dispatch(fetchUsers());

      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// ================= SLICE =================
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH USERS
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;

        // ✅ REMOVE DUPLICATES SAFETY
        const uniqueUsers = action.payload.filter(
          (user, index, self) =>
            index === self.findIndex((u) => u._id === user._id)
        );

        state.users = uniqueUsers;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // GLOBAL ERROR HANDLER
      .addMatcher(
        (action) => action.type.endsWith("rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export default adminSlice.reducer;
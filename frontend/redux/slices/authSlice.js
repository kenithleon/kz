import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// ================= LOAD FROM STORAGE =================
const userFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const tokenFromStorage = localStorage.getItem('userToken') || null;

// Guest ID
const initialGuestId =
  localStorage.getItem('guestId') || `guest_${new Date().getTime()}`;

localStorage.setItem('guestId', initialGuestId);

// ================= INITIAL STATE =================
const initialState = {
  user: userFromStorage,
  token: tokenFromStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

// ================= LOGIN =================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userData
      );

      const { user, token } = response.data;

      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('userToken', token);

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message || 'Login failed',
        }
      );
    }
  }
);

// ================= REGISTER =================
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userData
      );

      const { user, token } = response.data;

      localStorage.setItem('userInfo', JSON.stringify(user));
      localStorage.setItem('userToken', token);

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || {
          message: error.message || 'Register failed',
        }
      );
    }
  }
);

// ================= SLICE =================
const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');

      // generate new guest id
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem('guestId', state.guestId);
    },

    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem('guestId', state.guestId);
    },
  },

  extraReducers: (builder) => {
    builder
      // ===== LOGIN =====
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      })

      // ===== REGISTER =====
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; 
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message;
      });
  },
});

// ================= EXPORTS =================
export const { logout, generateNewGuestId } = authSlice.actions;
export default authSlice.reducer;
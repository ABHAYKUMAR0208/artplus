import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// Thunk for user registration
export const registerUser = createAsyncThunk(
  "/auth/register",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,

        {
          withCredentials: true,
        }
      );
      return response.data; // Return the API response data
    } catch (error) {
      // Return a custom error message
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);
// login
export const loginUser = createAsyncThunk(
  "/auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,

        {
          withCredentials: true,
        }
      );
      return response.data; // Return the API response data
    } catch (error) {
      // Return a custom error message
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

//new
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async ()=>  {
    
      const response = await axios.post(
        "http://localhost:5000/api/auth/logout",{},

        {
          withCredentials: true,
        }
      );
      return response.data; 
  }
);

//checkUth
export const checkAuth = createAsyncThunk(
  "/auth/checkauth",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/auth/check-auth",
        {
          withCredentials: true,
          headers : {
            'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate',
        
          }
        }
      );
      return response.data; // Return the API response data
    } catch (error) {
      // Return a custom error message
      return rejectWithValue(error.response?.data || "Registration failed");
    }
  }
);

// authSlice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        console.error("Registration failed:", action.payload);
      });

    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        console.error("Login failed:", action.payload);
      })
      
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        console.log(action);

        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        console.error("Login failed:", action.payload);
      })
      
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user =  null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;

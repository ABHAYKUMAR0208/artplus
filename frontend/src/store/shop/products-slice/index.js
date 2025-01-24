import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state for the products slice
const initialState = {
  isLoading: false,
  productList: [],
  productDetails: null,
  saleProducts: [],
  error: null, // To capture any errors
};

// Thunk to fetch all filtered products
export const fetchAllFilteredProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get?${query}`
    );

    return result?.data;
  }
);

// Thunk to fetch product details
export const fetchProductDetails = createAsyncThunk(
  "/products/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/products/get/${id}`
    );

    return result?.data;
  }
);

// Thunk to fetch sale products
export const fetchSaleProducts = createAsyncThunk(
  "/products/fetchSaleProducts",
  async () => {
    try {
      const result = await axios.get(`http://localhost:5000/api/shop/sale/get`);
      console.log("Fetched sale products:", result.data); // Log the fetched data
      return result.data;
    } catch (error) {
      console.error("Error fetching sale products:", error); // Log any errors
      throw error; // Rethrow the error to be caught in the slice
    }
  }
);

// Create the products slice
const shoppingProductSlice = createSlice({
  name: "shoppingProducts",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null; // Reset error on new request
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
        state.error = action.error.message; // Capture the error message
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchSaleProducts.pending, (state) => {
        state.isLoading = true; // Optional: Set loading state for sale products
        state.error = null; // Reset error on new request
      })
      .addCase(fetchSaleProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.saleProducts = action.payload; // Store sale products in state
      })
      .addCase(fetchSaleProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.saleProducts = []; // Reset sale products on error
        state.error = action.error.message; // Capture the error message
      });
  },
});

// Export the action to set product details
export const { setProductDetails } = shoppingProductSlice.actions;

// Export the reducer
export default shoppingProductSlice.reducer;
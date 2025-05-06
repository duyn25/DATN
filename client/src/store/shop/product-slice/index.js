import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  categoryList:[],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/product/fetchAllProducts",
  async ({ filterParams, sortParams }) => {
    console.log(fetchAllFilteredProducts, "fetchAllFilteredProducts");

    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `http://localhost:5000/api/shop/product/get?${query}`
    );


    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  "/product/fetchProductDetails",
  async (id) => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/product/get/${id}`
    );
    return result?.data;
  }
);

export const fetchCategories = createAsyncThunk(
  "/product/fetchCategories",
  async () => {
    const result = await axios.get(
      `http://localhost:5000/api/shop/product/category/get` );
    return result?.data;
  }
);

const shopProductSlice = createSlice({
  name: "shopProduct",
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.productDetails = null;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data; 
      })
      .addCase(fetchCategories.rejected, (state) => {
        state.isLoading = false;
        state.categoryList = [];
      });
      
  },
});

export const { setProductDetails } = shopProductSlice.actions;

export default shopProductSlice.reducer;
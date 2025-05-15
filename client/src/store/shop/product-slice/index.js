import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
  categoryList: [],
  productDetails: null,
};

export const fetchAllFilteredProducts = createAsyncThunk(
  "/product/fetchAllProducts",
  async ({ filterParams = {}, sortParams }) => {
    const { brand, priceRange, categoryId, ...specs } = filterParams;

    const query = new URLSearchParams();

    if (brand?.length) query.append("brand", brand.join(","));
    if (priceRange?.length) {
      const [minPrice, maxPrice] = priceRange[0].split("-");
      query.append("minPrice", minPrice);
      query.append("maxPrice", maxPrice);
    }
    if (categoryId) query.append("categoryId", categoryId);

    // specs: các specId hợp lệ
    const validSpecs = {};
    for (const key in specs) {
      if (/^[a-fA-F0-9]{24}$/.test(key)) {
        validSpecs[key] = specs[key];
      }
    }
    if (Object.keys(validSpecs).length > 0) {
      query.append("specs", JSON.stringify(validSpecs));
    }

    if (sortParams) query.append("sortBy", sortParams);

    const result = await axios.get(
      `http://localhost:5000/api/shop/product/get?${query.toString()}`
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
      `http://localhost:5000/api/shop/product/category/get`
    );
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
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
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

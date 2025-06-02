import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  productList: [],
};

// ✅ Helper
const transformSpecifications = (specObj = {}) =>
  Object.entries(specObj).map(([specId, value]) => ({ specId, value }));

export const addNewProduct = createAsyncThunk(
  "/products/addnewproduct",
  async (formData) => {
    const payload = {
      ...formData,
      specifications: transformSpecifications(formData.specifications),
    };

    const result = await axios.post(
      "http://localhost:5000/api/admin/product/add",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const fetchAllProducts = createAsyncThunk(
  "/products/fetchAllProducts",
  async () => {
    const result = await axios.get("http://localhost:5000/api/admin/product/get");
    return result?.data;
  }
);

export const editProduct = createAsyncThunk(
  "/products/editProduct",
  async ({ id, formData }) => {
    const payload = {
      ...formData,
      specifications: transformSpecifications(formData.specifications),
    };

    const result = await axios.put(
      `http://localhost:5000/api/admin/product/edit/${id}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/deleteProduct",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/product/delete/${id}`
    );
    return result?.data;
  }
);

const AdminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(editProduct.fulfilled, (state, action) => {
        const updated = action.payload.data;
        const index = state.productList.findIndex(p => p._id === updated._id);
        if (index !== -1) {
          state.productList[index] = updated;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.productList = state.productList.filter(p => p._id !== action.payload.id);
      });
      
  },
});

export default AdminProductSlice.reducer;

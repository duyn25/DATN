import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  specificationList: [],
};

export const addNewSpec = createAsyncThunk(
  "/specification/addnewSpec",
  async (formData) => {
    const result = await axios.post(
      "http://localhost:5000/api/admin/specification/add",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        
      }
    );

    return result?.data;
  }
);

export const fetchAllSpecs = createAsyncThunk(
  "/specification/fetchAllSpecs",
  async () => {
    const result = await axios.get(
      "http://localhost:5000/api/admin/specification/get"
    );

    return result?.data;
  }
);

export const editSpec = createAsyncThunk(
  "/specification/editSpec",
  async ({ id, formData }) => {
    const result = await axios.put(
      `http://localhost:5000/api/admin/specification/edit/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return result?.data;
  }
);

export const deleteSpec = createAsyncThunk(
  "/specification/deleteSpec",
  async (id) => {
    const result = await axios.delete(
      `http://localhost:5000/api/admin/specification/delete/${id}`
    );

    return result?.data;
  }
);

const AdminSpecificationSlice = createSlice({
  name: "adminSpecifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSpecs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllSpecs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.specificationList = action.payload.data;
      })
      .addCase(fetchAllSpecs.rejected, (state, action) => {
        state.isLoading = false;
        state.specificationList = [];
      });
  },
});

export default AdminSpecificationSlice.reducer;
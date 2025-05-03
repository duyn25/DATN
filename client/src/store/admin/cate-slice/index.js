import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isLoading: false,
  categoryList: [],
};

// Thunk để thêm danh mục mới
export const addNewCategory = createAsyncThunk(
  "/category/addNewCategory",  // Action type
  async (formData) => {
      const result = await axios.post(
        "http://localhost:5000/api/admin/category/add",  // API endpoint
        formData,  // Dữ liệu gửi lên
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;  // Dữ liệu trả về từ API
  }
);

// Thunk để lấy tất cả danh mục
export const fetchAllCategories = createAsyncThunk(
  "/category/fetchAllCategories",
  async () => {
    
      const result = await axios.get(
        "http://localhost:5000/api/admin/category/get"
      );
      console.log("Kết quả API:", result?.data);

      return result?.data;  // Dữ liệu trả về từ API
    
  }
);

// Thunk để chỉnh sửa danh mục
export const editCategory = createAsyncThunk(
  "/category/editCategory",
  async ({ id, formData }) => {
    
      const result = await axios.put(
        `http://localhost:5000/api/admin/category/edit/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return result?.data;  // Dữ liệu trả về từ API
   
  }
);

// Thunk để xóa danh mục
export const deleteCategory = createAsyncThunk(
  "/category/deleteCategory",
  async (id) => {
    
      const result = await axios.delete(
        `http://localhost:5000/api/admin/category/delete/${id}`
      );
      return result?.data;  
   
  }
);

const AdminCategorySlice = createSlice({
  name: "adminCategories", 
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryList = action.payload.data;  
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.categoryList = [];
      })
      .addCase(addNewCategory.fulfilled, (state, action) => {
        state.categoryList.push(action.payload.data); // <-- đảm bảo payload.data đã có field specifications
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        const index = state.categoryList.findIndex(
          (category) => category._id === action.payload.data._id
        );
        if (index !== -1) {
          state.categoryList[index] = action.payload.data; // dữ liệu đã đầy đủ specifications
        }
      });
      
  },
});

export default AdminCategorySlice.reducer;

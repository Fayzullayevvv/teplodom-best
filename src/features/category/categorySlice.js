import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initCategoryState = {
  categories: [],
  isLoading: false,
  status: "idle",
  error: null,
};

export const fetchAllCategories = createAsyncThunk(
  "category/fetchAllCategories",
  async ({ isAll = true, limit = 5 } = {}) => {
    let url = "https://teplodom-backend.vercel.app/categories";

    if (!isAll) url += `?_limit=${limit}`;

    const response = await fetch(url);
    const data = await response.json();
    return data;
  },
);

const categorySlice = createSlice({
  name: "category",
  initialState: initCategoryState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.isLoading = true;
        state.status = "loading";
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

// export const categoryActions = categorySlice.actions;
export default categorySlice.reducer;

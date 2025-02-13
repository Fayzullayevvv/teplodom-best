import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initProductState = {
  allProducts: [],
  isLoading: false,
  status: "idle",
  error: null,
  popularProducts: [],
  newProducts: [],
};

export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async () => {
    const response = await fetch("https://teplodom-backend.vercel.app/ProductCard");
    const data = await response.json();
    return data;
  }
);

export const toggleProductLike = createAsyncThunk(
  "product/toggleLike",
  async ({ productId, isLiked }) => {
    try {
      const patchResponse = await fetch(
        `https://teplodom-backend.vercel.app/ProductCard/${productId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isLiked: !isLiked }),
        }
      );

      return await patchResponse.json();
    } catch (error) {
      throw error.message;
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState: initProductState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = "succeeded";
        state.allProducts = action.payload;
        action.payload.sort((a, b) => b.liked - a.liked);

        // console.log(action.payload, "Slice");
        

        state.popularProducts = action.payload;

        // console.log(state.popularProducts);
        

        state.newProducts = action.payload.filter((p) => p.isNew);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(toggleProductLike.fulfilled, (state, action) => {
        state.allProducts = state.allProducts.map((p) => {
          if (p.id === action.payload.id) {
            return action.payload;
          } else {
            return p;
          }
        });        
      });
  },
});

export default productSlice.reducer;

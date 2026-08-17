import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchWishlist = createAsyncThunk("wishlist/fetch", async () => {
  const { data } = await api.get("/wishlist");
  return data;
});

export const toggleWishlistItem = createAsyncThunk("wishlist/toggle", async (productId) => {
  const { data } = await api.post("/wishlist/toggle", { productId });
  return data;
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { products: [], status: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.products = action.payload.products; })
      .addCase(toggleWishlistItem.fulfilled, (state, action) => { state.products = action.payload.wishlist.products; });
  },
});

export default wishlistSlice.reducer;

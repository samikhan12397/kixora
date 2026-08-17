import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchCart = createAsyncThunk("cart/fetch", async () => {
  const { data } = await api.get("/cart");
  return data;
});

export const addToCart = createAsyncThunk("cart/add", async (payload) => {
  const { data } = await api.post("/cart", payload);
  return data;
});

export const removeFromCart = createAsyncThunk("cart/remove", async (itemId) => {
  const { data } = await api.delete(`/cart/${itemId}`);
  return data;
});

const cartSlice = createSlice({
  name: "cart",
  initialState: { items: [], status: "idle", drawerOpen: false },
  reducers: {
    openDrawer(state) { state.drawerOpen = true; },
    closeDrawer(state) { state.drawerOpen = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => { state.items = action.payload.items; })
      .addCase(addToCart.fulfilled, (state, action) => { state.items = action.payload.items; state.drawerOpen = true; })
      .addCase(removeFromCart.fulfilled, (state, action) => { state.items = action.payload.items; });
  },
});

export const { openDrawer, closeDrawer } = cartSlice.actions;
export default cartSlice.reducer;

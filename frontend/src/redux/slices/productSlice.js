import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api.js";

export const fetchProducts = createAsyncThunk("products/fetch", async (params = {}) => {
  const { data } = await api.get("/products", { params });
  return data;
});

export const fetchFeaturedGroups = createAsyncThunk("products/fetchFeatured", async () => {
  const { data } = await api.get("/products/featured-groups");
  return data;
});

const productSlice = createSlice({
  name: "products",
  initialState: {
    list: [], page: 1, pages: 1, total: 0,
    featured: [], newArrivals: [], bestSellers: [], limitedEdition: [],
    status: "idle",
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = "loading"; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload.products;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(fetchFeaturedGroups.fulfilled, (state, action) => {
        state.featured = action.payload.featured;
        state.newArrivals = action.payload.newArrivals;
        state.bestSellers = action.payload.bestSellers;
        state.limitedEdition = action.payload.limitedEdition;
      });
  },
});

export default productSlice.reducer;

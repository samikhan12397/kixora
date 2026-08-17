import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { sidebarOpen: false, toast: null },
  reducers: {
    openSidebar(state) { state.sidebarOpen = true; },
    closeSidebar(state) { state.sidebarOpen = false; },
    showToast(state, action) { state.toast = action.payload; },
    clearToast(state) { state.toast = null; },
  },
});

export const { openSidebar, closeSidebar, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;

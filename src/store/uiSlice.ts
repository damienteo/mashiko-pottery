import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface UIState {
  sidebarOpen: boolean;
  modalOpen: boolean;
}

const initialState: UIState = {
  sidebarOpen: false,
  modalOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openSidebar(state) {
      state.sidebarOpen = true;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    openModal(state) {
      state.modalOpen = true;
    },
    closeModal(state) {
      state.modalOpen = false;
    },
  },
});

export const { openSidebar, closeSidebar, openModal, closeModal } =
  uiSlice.actions;
export const selectUI = (state: RootState) => state.ui;

export default uiSlice.reducer;

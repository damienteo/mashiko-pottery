import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { InventoryItem } from "@/types/inventory";

interface SellerInventoryState {
  items: InventoryItem[];
}

const initialState: SellerInventoryState = {
  items: [],
};

const sellerInventorySlice = createSlice({
  name: "sellerInventory",
  initialState,
  reducers: {
    setInventory(state, action: PayloadAction<InventoryItem[]>) {
      state.items = action.payload;
    },
    addItem(state, action: PayloadAction<InventoryItem>) {
      state.items.push(action.payload);
    },
    updateItem(state, action: PayloadAction<InventoryItem>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { setInventory, addItem, updateItem, removeItem } =
  sellerInventorySlice.actions;

export default sellerInventorySlice.reducer;

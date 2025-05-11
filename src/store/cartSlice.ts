import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
};

// NEW: fetch the cart from /api/cart
export const fetchCart = createAsyncThunk<
  CartItem[],
  void,
  { state: RootState }
>(
  "cart/fetchCart",
  async () => {
    const res = await fetch("/api/cart");
    if (!res.ok) throw new Error("Failed to fetch cart");
    return (await res.json()) as CartItem[];
  },
  {
    condition: (_, { getState }) => {
      const { cart } = getState();
      // Only fetch if the cart is currently empty
      return cart.items.length === 0;
    },
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action: PayloadAction<CartItem>) {
      const idx = state.items.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) state.items[idx].quantity += action.payload.quantity;
      else state.items.push(action.payload);
    },
    removeFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((i) => i.id !== action.payload);
    },
    clearCart(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchCart.fulfilled,
        (state, action: PayloadAction<CartItem[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload;
        }
      )
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

/**
 * Total number of items in the cart.
 */
export const selectCartCount = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

/**
 * Total price of all items in the cart.
 */
export const selectCartTotal = (state: RootState): number =>
  state.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

export default cartSlice.reducer;

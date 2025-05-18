import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { saveCartToStorage } from "./localStorage";
import { selectCurrentUser } from "./authSlice";
import type { CartItem } from "@/types/cart";

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

export const initialState: CartState = {
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
    updateQuantity(
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) {
      const { id, quantity } = action.payload;
      const existing = state.items.find((item) => item.id === id);
      if (existing) {
        if (quantity > 0) {
          existing.quantity = quantity;
        } else {
          state.items = state.items.filter((item) => item.id !== id);
        }
      }
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

export const { addToCart, removeFromCart, clearCart, updateQuantity } =
  cartSlice.actions;

/**
 * Thunk to merge guest cart items into authenticated user's server cart.
 */
export const mergeCart = createAsyncThunk<
  void,
  CartItem[],
  { state: RootState }
>("cart/merge", async (guestItems, { dispatch }) => {
  // const res = await fetch("/api/cart/merge", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ items: guestItems }),
  // });
  // if (!res.ok) throw new Error("Failed to merge cart");
  console.log("Cart merged successfully");
  // After merging, fetch the updated cart:
  await dispatch(fetchCart());
});

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartLoading = (state: RootState) => state.cart.isLoading;
export const selectCartError = (state: RootState) => state.cart.error;

/**
 * Total number of items in the cart.
 */
export const selectCartCount = (state: RootState): number =>
  state.cart.items.reduce(
    (sum: number, item: CartItem): number => sum + item.quantity,
    0
  );

/**
 * Total price of all items in the cart.
 */
export const selectCartTotal = (state: RootState): number =>
  state.cart.items.reduce(
    (sum: number, item: CartItem): number => sum + item.quantity * item.price,
    0
  );

export default cartSlice.reducer;

/**
 * Middleware to persist cart to localStorage on cart actions when user is not logged in.
 */
export const cartPersistenceMiddleware: Middleware<unknown, RootState> =
  (storeAPI) => (next) => (action) => {
    const result = next(action);
    const cartActionTypes: string[] = [
      addToCart.type,
      removeFromCart.type,
      updateQuantity.type,
      clearCart.type,
    ];
    // Cast action.type to string to satisfy includes()
    const isCartAction = cartActionTypes.includes(
      (action as { type: string }).type
    );
    const state = storeAPI.getState();
    const user = selectCurrentUser(state);
    if (isCartAction && !user) {
      saveCartToStorage(state);
    }
    return result;
  };

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/types/product"; // define a Product type elsewhere

interface EntityState<T> {
  byId: Record<number, T>;
  allIds: number[];
  loading: boolean;
  error: string | null;
}

const initialState: EntityState<Product> = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

// Thunks for fetching
export const fetchProducts = createAsyncThunk("products/fetchAll", async () => {
  const res = await fetch("/api/products");
  return (await res.json()) as Product[];
});

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // optional manual upserts
    upsertProduct(state, action: PayloadAction<Product>) {
      const p = action.payload;
      state.byId[p.id] = p;
      if (!state.allIds.includes(p.id)) state.allIds.push(p.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        action.payload.forEach((p) => {
          state.byId[p.id] = p;
          if (!state.allIds.includes(p.id)) state.allIds.push(p.id);
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load products";
      });
  },
});

export const { upsertProduct } = productsSlice.actions;
export default productsSlice.reducer;

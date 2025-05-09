import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Product } from "./productDetailsSlice";

// Async thunk: fetch all products
export const fetchProductsList = createAsyncThunk<Product[], void>(
  "productsList/fetchAll",
  async () => {
    const res = await fetch("/api/products");
    if (!res.ok) throw new Error("Failed to fetch products");
    return (await res.json()) as Product[];
  }
);

interface ProductsListState {
  items: Product[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: ProductsListState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
};

const productsListSlice = createSlice({
  name: "productsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductsList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchProductsList.fulfilled,
        (state, action: PayloadAction<Product[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload;
        }
      )
      .addCase(fetchProductsList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectAllProducts = (state: RootState) => state.productsList.items;
export const selectProductsListIsLoading = (state: RootState) =>
  state.productsList.isLoading;
export const selectProductsListIsSuccess = (state: RootState) =>
  state.productsList.isSuccess;
export const selectProductsListError = (state: RootState) =>
  state.productsList.error;

export default productsListSlice.reducer;

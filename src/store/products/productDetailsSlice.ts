import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

/** Supported locales for this app */
export type Locale = "en" | "ja" | "zh-CN";

/** A map of translations for each supported locale */
export type LocalizedString = Record<Locale, string>;

export interface Product {
  id: number;
  /** Titles in each supported locale */
  title: LocalizedString;
  price: number;
  inventory: number;
  /** Descriptions in each supported locale */
  description: LocalizedString;
  photos: string[];
}

// Async thunk: fetch one product
export const fetchProductDetails = createAsyncThunk<Product, string>(
  "productDetails/fetchById",
  async (id) => {
    const res = await fetch(`/api/products/${id}`);
    if (!res.ok) throw new Error("Failed to load product");
    return (await res.json()) as Product;
  }
);

interface ProductDetailState {
  entity: Product | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: ProductDetailState = {
  entity: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchProductDetails.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.entity = action.payload;
        }
      )
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectProductDetails = (state: RootState) =>
  state.productDetails.entity;
export const selectProductDetailsIsLoading = (state: RootState) =>
  state.productDetails.isLoading;
export const selectProductDetailsIsSuccess = (state: RootState) =>
  state.productDetails.isSuccess;
export const selectProductDetailsError = (state: RootState) =>
  state.productDetails.error;

export default productDetailsSlice.reducer;

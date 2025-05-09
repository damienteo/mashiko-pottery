import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
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

export const selectProductDetail = (state: RootState) =>
  state.productDetails.entity;
export const selectProductDetailIsLoading = (state: RootState) =>
  state.productDetails.isLoading;
export const selectProductDetailIsSuccess = (state: RootState) =>
  state.productDetails.isSuccess;
export const selectProductDetailError = (state: RootState) =>
  state.productDetails.error;

export default productDetailsSlice.reducer;

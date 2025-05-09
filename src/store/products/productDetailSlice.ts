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
export const fetchProductDetail = createAsyncThunk<Product, string>(
  "productDetail/fetchById",
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

const productDetailSlice = createSlice({
  name: "productDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductDetail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchProductDetail.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.entity = action.payload;
        }
      )
      .addCase(fetchProductDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectProductDetail = (state: RootState) =>
  state.productDetail.entity;
export const selectProductDetailIsLoading = (state: RootState) =>
  state.productDetail.isLoading;
export const selectProductDetailIsSuccess = (state: RootState) =>
  state.productDetail.isSuccess;
export const selectProductDetailError = (state: RootState) =>
  state.productDetail.error;

export default productDetailSlice.reducer;

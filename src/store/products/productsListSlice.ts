import { createSlice,  PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Product } from "@/types/product";

import { fetchProductsList } from "../thunks/fetchProductsList";

import type { ProductFilters, Pagination } from "@/types/common";

interface ProductsListState {
  items: Product[];
  filters: ProductFilters;
  pagination: Pagination;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: ProductsListState = {
  items: [],
  filters: {
    name: null,
    category: null,
    active: null,
    style: null,
    priceMin: null,
    priceMax: null,
  },
  pagination: {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  },
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
        (
          state,
          action: PayloadAction<{
            products: Product[];
            filters: ProductFilters;
            pagination: Pagination;
          }>
        ) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload.products;
          state.filters = action.payload.filters;
          state.pagination = action.payload.pagination;
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

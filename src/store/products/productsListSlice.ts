import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
    category: null,
    active: null,
    style: null,
    priceMin: null,
    priceMax: null,
    potterId: null,
    q: null,
    locale: null,
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
  reducers: {
    setProductsFilters(state, action: PayloadAction<Partial<ProductFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    resetProductsFilters(state) {
      state.filters = {
        category: null,
        active: null,
        style: null,
        priceMin: null,
        priceMax: null,
        potterId: null,
        q: null,
        locale: null,
      };
      state.pagination.page = 1;
    },
    setProductsPage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    setProductsLimit(state, action: PayloadAction<number>) {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
    },
    resetProductsListState(state) {
      state.items = [];
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
      state.filters = {
        category: null,
        active: null,
        style: null,
        priceMin: null,
        priceMax: null,
        potterId: null,
        q: null,
        locale: null,
      };
      state.pagination = {
        limit: 10,
        page: 1,
        total: 0,
        totalPages: 0,
      };
    },
    hydrateProductsList(
      state,
      action: PayloadAction<{
        products: Product[];
        filters: ProductFilters;
        pagination: Pagination;
      }>,
    ) {
      state.items = action.payload.products;
      state.filters = { ...state.filters, ...action.payload.filters };
      state.pagination = action.payload.pagination;
      state.isLoading = false;
      state.isSuccess = true;
      state.error = null;
    },
  },
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
          }>,
        ) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload.products;
          state.filters = action.payload.filters;
          state.pagination = action.payload.pagination;
        },
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
export const selectProductsListFilters = (state: RootState) =>
  state.productsList.filters;
export const selectProductsListPagination = (state: RootState) =>
  state.productsList.pagination;

export const {
  setProductsFilters,
  resetProductsFilters,
  setProductsPage,
  setProductsLimit,
  resetProductsListState,
  hydrateProductsList,
} = productsListSlice.actions;

export default productsListSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Potter } from "@/types/potter";

import type { PotterFilters, Pagination } from "@/types/common";

// Async thunk: fetch all potters
export const fetchPottersList = createAsyncThunk<
  { potters: Potter[]; filters: PotterFilters; pagination: Pagination },
  {
    page?: number;
    limit?: number;
    name?: string;
    style?: string;
    active?: string;
  }
>("pottersList/fetchAll", async (params) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.name) query.set("name", params.name);
  if (params.style) query.set("style", params.style);
  if (params.active) query.set("active", params.active);

  const res = await fetch(`/api/potters?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch potters");
  const response = await res.json();
  return {
    potters: response.potters,
    filters: response.filters,
    pagination: response.pagination,
  };
});

interface PottersListState {
  items: Potter[];
  filters: PotterFilters;
  pagination: Pagination;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: PottersListState = {
  items: [],
  filters: {
    name: null,
    style: null,
    active: null,
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

const pottersListSlice = createSlice({
  name: "pottersList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPottersList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchPottersList.fulfilled,
        (
          state,
          action: PayloadAction<{
            potters: Potter[];
            filters: PotterFilters;
            pagination: Pagination;
          }>
        ) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload.potters;
          state.filters = action.payload.filters;
          state.pagination = action.payload.pagination;
        }
      )
      .addCase(fetchPottersList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectAllPotters = (state: RootState) => state.pottersList.items;
export const selectPottersListIsLoading = (state: RootState) =>
  state.pottersList.isLoading;
export const selectPottersListIsSuccess = (state: RootState) =>
  state.pottersList.isSuccess;
export const selectPottersListError = (state: RootState) =>
  state.pottersList.error;

export default pottersListSlice.reducer;

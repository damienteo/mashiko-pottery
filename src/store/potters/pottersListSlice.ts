import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Potter } from "@/types/potter";

interface Filters {
  name: string | null;
  style: string | null;
  active: boolean | null;
}

interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

// Async thunk: fetch all potters
export const fetchPottersList = createAsyncThunk<
  { potters: Potter[]; filters: Filters; pagination: Pagination },
  void
>("pottersList/fetchAll", async () => {
  const res = await fetch("/api/potters");
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
  filters: Filters;
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
            filters: Filters;
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

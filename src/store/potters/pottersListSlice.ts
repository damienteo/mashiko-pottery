import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Potter } from "./potterDetailSlice";

// Async thunk: fetch all potters
export const fetchPottersList = createAsyncThunk<Potter[], void>(
  "pottersList/fetchAll",
  async () => {
    const res = await fetch("/api/potters");
    if (!res.ok) throw new Error("Failed to fetch potters");
    return (await res.json()) as Potter[];
  }
);

interface PottersListState {
  items: Potter[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: PottersListState = {
  items: [],
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
        (state, action: PayloadAction<Potter[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload;
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

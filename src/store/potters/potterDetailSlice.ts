import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface Potter {
  id: number;
  name: string;
  bio: string;
}

// Async thunk: fetch one potter
export const fetchPotterDetail = createAsyncThunk<Potter, string>(
  "potterDetail/fetchById",
  async (id) => {
    const res = await fetch(`/api/potters/${id}`);
    if (!res.ok) throw new Error("Failed to load potter");
    return (await res.json()) as Potter;
  }
);

interface PotterDetailState {
  entity: Potter | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: PotterDetailState = {
  entity: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

const potterDetailSlice = createSlice({
  name: "potterDetail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPotterDetail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchPotterDetail.fulfilled,
        (state, action: PayloadAction<Potter>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.entity = action.payload;
        }
      )
      .addCase(fetchPotterDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectPotterDetail = (state: RootState) =>
  state.potterDetail.entity;
export const selectPotterDetailIsLoading = (state: RootState) =>
  state.potterDetail.isLoading;
export const selectPotterDetailIsSuccess = (state: RootState) =>
  state.potterDetail.isSuccess;
export const selectPotterDetailError = (state: RootState) =>
  state.potterDetail.error;

export default potterDetailSlice.reducer;

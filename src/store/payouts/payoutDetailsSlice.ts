import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface PayoutDetail {
  potterId: number;
  month: string;
  amount: number;
  commissionRate: number;
  // add any extra fields here, e.g. breakdown of sales, fees, etc.
}

interface PayoutDetailState {
  detail: PayoutDetail | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: PayoutDetailState = {
  detail: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Thunk to fetch a single payout by a composite ID string (e.g. "2025-05|42")
export const fetchPayoutDetail = createAsyncThunk<PayoutDetail, string>(
  "payoutDetails/fetchById",
  async (payoutId) => {
    const res = await fetch(`/api/payouts/${payoutId}`);
    if (!res.ok) throw new Error("Failed to fetch payout detail");
    return (await res.json()) as PayoutDetail;
  }
);

const payoutDetailSlice = createSlice({
  name: "payoutDetails",
  initialState,
  reducers: {
    clearPayoutDetail(state) {
      state.detail = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayoutDetail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchPayoutDetail.fulfilled,
        (state, action: PayloadAction<PayoutDetail>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.detail = action.payload;
        }
      )
      .addCase(fetchPayoutDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { clearPayoutDetail } = payoutDetailSlice.actions;

export const selectPayoutDetail = (state: RootState) =>
  state.payoutDetails.detail;
export const selectPayoutDetailIsLoading = (state: RootState) =>
  state.payoutDetails.isLoading;
export const selectPayoutDetailIsSuccess = (state: RootState) =>
  state.payoutDetails.isSuccess;
export const selectPayoutDetailError = (state: RootState) =>
  state.payoutDetails.error;

export default payoutDetailSlice.reducer;

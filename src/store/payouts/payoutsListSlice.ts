import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PayoutStatus } from "@/constants/payoutStatus";
import type { PayoutSummary } from "@/types/payout";

interface PayoutsListState {
  items: PayoutSummary[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: PayoutsListState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Thunk to fetch all payouts
export const fetchPayoutsList = createAsyncThunk<PayoutSummary[], void>(
  "payouts/fetchAll",
  async () => {
    const res = await fetch("/api/payouts");
    if (!res.ok) throw new Error("Failed to fetch payouts list");
    return (await res.json()) as PayoutSummary[];
  },
);

const payoutsListSlice = createSlice({
  name: "payoutsList",
  initialState,
  reducers: {
    updatePayoutStatus(
      state,
      action: PayloadAction<{
        potterId: string;
        month: string;
        status: PayoutStatus;
      }>,
    ) {
      const { potterId, month, status } = action.payload;
      const payout = state.items.find(
        (p) => p.potterId === potterId && p.month === month,
      );
      if (payout) {
        payout.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayoutsList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchPayoutsList.fulfilled,
        (state, action: PayloadAction<PayoutSummary[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload;
        },
      )
      .addCase(fetchPayoutsList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectAllPayouts = (state: RootState) => state.payoutsList.items;
export const selectPayoutsListIsLoading = (state: RootState) =>
  state.payoutsList.isLoading;
export const selectPayoutsListIsSuccess = (state: RootState) =>
  state.payoutsList.isSuccess;
export const selectPayoutsListError = (state: RootState) =>
  state.payoutsList.error;

export const { updatePayoutStatus } = payoutsListSlice.actions;
export default payoutsListSlice.reducer;

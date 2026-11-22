import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { PayoutDetails } from "@/types/payout";

interface PayoutDetailState {
  detail: PayoutDetails | null;
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
export const fetchPayoutDetails = createAsyncThunk<PayoutDetails, string>(
  "payoutDetails/fetchById",
  async (payoutId) => {
    const res = await fetch(`/api/payouts/${payoutId}`);
    if (!res.ok) throw new Error("Failed to fetch payout details");
    return (await res.json()) as PayoutDetails;
  },
);

export const updatePayoutDetails = createAsyncThunk<
  PayoutDetails,
  { id: string; updates: Partial<PayoutDetails> }
>("payoutDetails/update", async ({ id, updates }) => {
  const res = await fetch(`/api/payouts/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update payout details");
  return (await res.json()) as PayoutDetails;
});

const payoutDetailsSlice = createSlice({
  name: "payoutDetails",
  initialState,
  reducers: {
    clearPayoutDetails(state) {
      state.detail = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayoutDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchPayoutDetails.fulfilled,
        (state, action: PayloadAction<PayoutDetails>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.detail = action.payload;
        },
      )
      .addCase(fetchPayoutDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(updatePayoutDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        updatePayoutDetails.fulfilled,
        (state, action: PayloadAction<PayoutDetails>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.detail = action.payload;
        },
      )
      .addCase(updatePayoutDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { clearPayoutDetails } = payoutDetailsSlice.actions;

export const selectPayoutDetails = (state: RootState) =>
  state.payoutDetails.detail;
export const selectPayoutDetailsIsLoading = (state: RootState) =>
  state.payoutDetails.isLoading;
export const selectPayoutDetailsIsSuccess = (state: RootState) =>
  state.payoutDetails.isSuccess;
export const selectPayoutDetailsError = (state: RootState) =>
  state.payoutDetails.error;

export default payoutDetailsSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PayoutDetails } from "@/types/payout";
import { RootState } from "../store";

interface SellerPayoutDetailsState {
  data: PayoutDetails | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: SellerPayoutDetailsState = {
  data: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

export const fetchSellerPayoutDetails = createAsyncThunk(
  "sellerPayoutDetails/fetchSellerPayoutDetails",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/seller/payouts/${id}`);
      if (!res.ok) throw new Error("Failed to fetch payout details");
      return (await res.json()) as PayoutDetails;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const sellerPayoutDetailsSlice = createSlice({
  name: "sellerPayoutDetails",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerPayoutDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
        state.data = null;
      })
      .addCase(fetchSellerPayoutDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.data = action.payload;
      })
      .addCase(fetchSellerPayoutDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      });
  },
});

export const selectSellerPayoutDetails = (state: RootState) =>
  state.sellerPayoutDetails.data;
export const selectSellerPayoutDetailsLoading = (state: RootState) =>
  state.sellerPayoutDetails.isLoading;
export const selectSellerPayoutDetailsError = (state: RootState) =>
  state.sellerPayoutDetails.error;
export const selectSellerPayoutDetailsSuccess = (state: RootState) =>
  state.sellerPayoutDetails.isSuccess;

export default sellerPayoutDetailsSlice.reducer;

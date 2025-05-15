import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Payout } from "@/types/payout";
import { RootState } from "../store";

interface SellerPayoutListState {
  items: Payout[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: SellerPayoutListState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
};

export const fetchSellerPayoutList = createAsyncThunk(
  "sellerPayoutList/fetchSellerPayoutList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch("/api/seller/payouts");
      if (!res.ok) throw new Error("Failed to fetch payouts");
      return (await res.json()) as Payout[];
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const sellerPayoutListSlice = createSlice({
  name: "sellerPayoutList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerPayoutList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(fetchSellerPayoutList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload;
      })
      .addCase(fetchSellerPayoutList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.payload as string;
      });
  },
});

export const selectSellerPayoutList = (state: RootState) =>
  state.sellerPayoutList.items;
export const selectSellerPayoutListLoading = (state: RootState) =>
  state.sellerPayoutList.isLoading;
export const selectSellerPayoutListError = (state: RootState) =>
  state.sellerPayoutList.error;

export default sellerPayoutListSlice.reducer;

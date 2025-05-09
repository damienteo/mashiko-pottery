import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface OrderDetail {
  id: string;
  status: string;
  items: Array<{
    id: number;
    title: string;
    quantity: number;
    price: number;
  }>;
}

interface OrderDetailState {
  detail: OrderDetail | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: OrderDetailState = {
  detail: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Thunk to fetch a single order by ID
export const fetchOrderDetail = createAsyncThunk<OrderDetail, string>(
  "orderDetails/fetchById",
  async (orderId) => {
    const res = await fetch(`/api/orders/${orderId}`);
    if (!res.ok) throw new Error("Failed to fetch order detail");
    return (await res.json()) as OrderDetail;
  }
);

const orderDetailSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    clearOrderDetail(state) {
      state.detail = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetail.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchOrderDetail.fulfilled,
        (state, action: PayloadAction<OrderDetail>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.detail = action.payload;
        }
      )
      .addCase(fetchOrderDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { clearOrderDetail } = orderDetailSlice.actions;

export const selectOrderDetail = (state: RootState) =>
  state.orderDetails.detail;
export const selectOrderDetailIsLoading = (state: RootState) =>
  state.orderDetails.isLoading;
export const selectOrderDetailIsSuccess = (state: RootState) =>
  state.orderDetails.isSuccess;
export const selectOrderDetailError = (state: RootState) =>
  state.orderDetails.error;

export default orderDetailSlice.reducer;

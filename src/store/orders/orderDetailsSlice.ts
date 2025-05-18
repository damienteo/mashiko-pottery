import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { OrderDetails } from "@/types/order";

interface OrderDetailState {
  details: OrderDetails | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: OrderDetailState = {
  details: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Thunk to fetch a single order by ID
export const fetchOrderDetails = createAsyncThunk<OrderDetails, string>(
  "orderDetails/fetchById",
  async (orderId) => {
    const res = await fetch(`/api/orders/${orderId}`);
    if (!res.ok) throw new Error("Failed to fetch order detail");
    return (await res.json()) as OrderDetails;
  }
);

// Thunk to update an order by ID
export const updateOrderDetails = createAsyncThunk<
  OrderDetails,
  { id: string; updates: Partial<OrderDetails> }
>("orderDetails/update", async ({ id, updates }) => {
  const res = await fetch(`/api/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update order detail");
  return (await res.json()) as OrderDetails;
});

const orderDetailSlice = createSlice({
  name: "orderDetails",
  initialState,
  reducers: {
    clearOrderDetails(state) {
      state.details = null;
      state.isLoading = false;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchOrderDetails.fulfilled,
        (state, action: PayloadAction<OrderDetails>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.details = action.payload;
        }
      )
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      })
      .addCase(updateOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        updateOrderDetails.fulfilled,
        (state, action: PayloadAction<OrderDetails>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.details = action.payload;
        }
      )
      .addCase(updateOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { clearOrderDetails } = orderDetailSlice.actions;

export const selectOrderDetails = (state: RootState) =>
  state.orderDetails.details;
export const selectOrderDetailsIsLoading = (state: RootState) =>
  state.orderDetails.isLoading;
export const selectOrderDetailsIsSuccess = (state: RootState) =>
  state.orderDetails.isSuccess;
export const selectOrderDetailsSuccess = selectOrderDetailsIsSuccess;
export const selectOrderDetailsError = (state: RootState) =>
  state.orderDetails.error;

export default orderDetailSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { OrderStatus } from "@/constants/orderStatus";
import type { OrderSummary } from "@/types/order";

interface OrdersListState {
  items: OrderSummary[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: OrdersListState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Async thunk to fetch all orders
export const fetchOrdersList = createAsyncThunk<OrderSummary[], void>(
  "orders/fetchAll",
  async () => {
    const res = await fetch("/api/orders");
    if (!res.ok) throw new Error("Failed to fetch orders");
    return (await res.json()) as OrderSummary[];
  }
);

const ordersListSlice = createSlice({
  name: "ordersList",
  initialState,
  reducers: {
    updateOrderStatus(
      state,
      action: PayloadAction<{ id: string; status: OrderStatus }>
    ) {
      const { id, status } = action.payload;
      const order = state.items.find((o) => o.id === id);
      if (order) {
        order.status = status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchOrdersList.fulfilled,
        (state, action: PayloadAction<OrderSummary[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload;
        }
      )
      .addCase(fetchOrdersList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectAllOrders = (state: RootState) => state.ordersList.items;
export const selectOrdersListIsLoading = (state: RootState) =>
  state.ordersList.isLoading;
export const selectOrdersListIsSuccess = (state: RootState) =>
  state.ordersList.isSuccess;
export const selectOrdersListError = (state: RootState) =>
  state.ordersList.error;

export const { updateOrderStatus } = ordersListSlice.actions;
export default ordersListSlice.reducer;

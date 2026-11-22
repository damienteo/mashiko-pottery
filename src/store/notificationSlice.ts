import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface Notification {
  id: string;
  message: string;
}

interface NotificationState {
  items: Notification[];
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Async thunk to fetch notifications
export const fetchNotifications = createAsyncThunk<Notification[]>(
  "notification/fetchAll",
  async () => {
    const res = await fetch("/api/notifications");
    if (!res.ok) throw new Error("Failed to fetch notifications");
    return (await res.json()) as Notification[];
  },
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications(state) {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<Notification[]>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.items = action.payload;
        },
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { clearNotifications } = notificationSlice.actions;
export const selectAllNotifications = (state: RootState) =>
  state.notification.items;
export const selectNotificationLoading = (state: RootState) =>
  state.notification.isLoading;
export const selectNotificationSuccess = (state: RootState) =>
  state.notification.isSuccess;
export const selectNotificationError = (state: RootState) =>
  state.notification.error;

export default notificationSlice.reducer;

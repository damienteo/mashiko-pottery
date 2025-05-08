import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface NotificationState {
  list: Notification[];
}

const initialState: NotificationState = { list: [] };

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.list.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.list = state.list.filter((n) => n.id !== action.payload);
    },
  },
});

export const { addNotification, removeNotification } =
  notificationSlice.actions;
export default notificationSlice.reducer;

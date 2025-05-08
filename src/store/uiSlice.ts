import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Notification {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}

interface UIState {
  isSidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: Notification[];
}

const initialState: UIState = {
  isSidebarOpen: false,
  theme: "light",
  notifications: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setTheme(state, action: PayloadAction<"light" | "dark">) {
      state.theme = action.payload;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.push(action.payload);
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const { toggleSidebar, setTheme, addNotification, removeNotification } =
  uiSlice.actions;
export default uiSlice.reducer;

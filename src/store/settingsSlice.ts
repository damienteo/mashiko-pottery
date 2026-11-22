import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export interface Settings {
  theme: "light" | "dark";
  language: string;
}

interface SettingsState {
  config: Settings;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  config: { theme: "light", language: "en" },
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Async thunk to load settings
export const fetchSettings = createAsyncThunk<Settings>(
  "settings/fetch",
  async () => {
    const res = await fetch("/api/settings");
    if (!res.ok) throw new Error("Failed to load settings");
    return (await res.json()) as Settings;
  },
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateTheme(state, action: PayloadAction<"light" | "dark">) {
      state.config.theme = action.payload;
    },
    updateLanguage(state, action: PayloadAction<string>) {
      state.config.language = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        fetchSettings.fulfilled,
        (state, action: PayloadAction<Settings>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.config = action.payload;
        },
      )
      .addCase(fetchSettings.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { updateTheme, updateLanguage } = settingsSlice.actions;
export const selectSettingsConfig = (state: RootState) => state.settings.config;
export const selectSettingsLoading = (state: RootState) =>
  state.settings.isLoading;
export const selectSettingsSuccess = (state: RootState) =>
  state.settings.isSuccess;
export const selectSettingsError = (state: RootState) => state.settings.error;

export default settingsSlice.reducer;

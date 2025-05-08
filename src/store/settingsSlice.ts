import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SettingsState {
  currency: "JPY" | "USD";
  languageOverride?: "en" | "ja" | "zh-CN";
}

const initialState: SettingsState = {
  currency: "JPY",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<"JPY" | "USD">) {
      state.currency = action.payload;
    },
    setLanguageOverride(state, action: PayloadAction<"en" | "ja" | "zh-CN">) {
      state.languageOverride = action.payload;
    },
  },
});

export const { setCurrency, setLanguageOverride } = settingsSlice.actions;
export default settingsSlice.reducer;

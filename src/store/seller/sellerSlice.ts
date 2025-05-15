// src/store/sellerSlice.ts

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define the seller profile type
export interface SellerProfile {
  id: number;
  // Localized fields: keys are locale codes ("en", "ja", "zh-CN", etc.)
  name: Record<string, string>;
  bio: Record<string, string>;
  portfolio: Record<string, string>;
}

// Async thunk: fetch the seller profile
export const fetchSellerProfile = createAsyncThunk<SellerProfile, void>(
  "seller/fetchProfile",
  async () => {
    const res = await fetch("/api/seller/profile");
    if (!res.ok) throw new Error("Failed to fetch seller profile");
    return (await res.json()) as SellerProfile;
  }
);

interface SellerState {
  profile: SellerProfile | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: SellerState = {
  profile: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

const sellerSlice = createSlice({
  name: "seller",
  initialState,
  reducers: {
    // Merge local updates into the profile
    updateSellerProfile(state, action: PayloadAction<Partial<SellerProfile>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    // Clear the profile (e.g., on logout)
    clearSellerProfile(state) {
      state.profile = null;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(fetchSellerProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.profile = action.payload;
      })
      .addCase(fetchSellerProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const { updateSellerProfile, clearSellerProfile } = sellerSlice.actions;

export const selectSellerProfile = (state: RootState) => state.seller.profile;
export const selectSellerLoading = (state: RootState) => state.seller.isLoading;
export const selectSellerSuccess = (state: RootState) => state.seller.isSuccess;
export const selectSellerError = (state: RootState) => state.seller.error;

export default sellerSlice.reducer;

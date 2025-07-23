import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import type { User, Credentials } from "@/types/auth";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

// Async thunk for login
export const login = createAsyncThunk<User, Credentials>(
  "auth/login",
  async (creds, { rejectWithValue }) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || "Login failed");
    }
    const { id, email, user_metadata } = await res.json();
    return {
      id,
      email,
      role: user_metadata?.role || "user",
    } as User;
  }
);

// Async thunk for registration
export const register = createAsyncThunk<User, Credentials>(
  "auth/register",
  async (creds, { rejectWithValue }) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds),
    });
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || "Registration failed");
    }
    const { id, email, user_metadata } = await res.json();
    return {
      id,
      email,
      role: user_metadata?.role || "user",
    } as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthSuccess = (state: RootState) => state.auth.isSuccess;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

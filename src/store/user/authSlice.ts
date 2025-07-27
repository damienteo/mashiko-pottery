import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { User, Credentials } from "@/types/user";
import { supabase } from "@/lib/supabase/client";

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

// TODO: Update Supabase Dashboard ->  Authentication → URL Configuration → Site URL when site url is confirmed
export const signUpWithOtp = createAsyncThunk<void, string>(
  "auth/signUpWithOtp",
  async (email, { rejectWithValue }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: "https://mashiko-pottery.vercel.app/",
      },
    });
    if (error) return rejectWithValue(error.message);
  }
);

// Async thunk to sign in with either password or OTP (magic-link)
// Now accepts an optional callback for OTP magic-link redirects
export const signInWithPasswordOrOtp = createAsyncThunk<
  User | null,
  Credentials & { callback?: string }
>(
  "auth/signInWithPasswordOrOtp",
  async ({ email, password, callback }, { rejectWithValue }) => {
    const { data, error } = password
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signInWithOtp({
          email,
          options: callback ? { emailRedirectTo: callback } : {},
        });
    console.log({ data, error });
    if (error) {
      return rejectWithValue(error.message);
    }

    // On signInWithOtp, data.user will be null, since it's just a magic link sent, and not actually signed in yet
    if (!data.user) return null;

    const { id, email: userEmail } = data.user;
    return {
      id,
      email: userEmail,
    } as User;
  }
);

export const verifyEmailOtp = createAsyncThunk<
  User,
  { email: string; token: string }
>("auth/verifyEmailOtp", async ({ email, token }, { rejectWithValue }) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });

  if (error || !data.user) {
    return rejectWithValue(error?.message || "OTP verification failed");
  }

  const { id, email: userEmail } = data.user;
  return {
    id,
    email: userEmail,
  } as User;
});

export const logoutUser = createAsyncThunk<void>(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) return rejectWithValue(error.message);
  }
);

export const fetchSupabaseUser = createAsyncThunk<User | null>(
  "auth/fetchSupabaseUser",
  async () => {
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();

    console.log({ sessionData, sessionError });
    if (sessionError || !sessionData.session?.user) return null;

    const { id, email } = sessionData.session.user;
    return {
      id,
      email,
    } as User;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUpWithOtp.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(signUpWithOtp.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(signUpWithOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(signInWithPasswordOrOtp.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        signInWithPasswordOrOtp.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.isLoading = false;
          state.isSuccess = !!action.payload;
          state.user = action.payload;
        }
      )
      .addCase(signInWithPasswordOrOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(verifyEmailOtp.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        verifyEmailOtp.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.user = action.payload;
        }
      )
      .addCase(verifyEmailOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(fetchSupabaseUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSupabaseUser.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.isLoading = false;
          state.user = action.payload;
        }
      )
      .addCase(fetchSupabaseUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectAuthLoading = (state: RootState) => state.auth.isLoading;
export const selectAuthSuccess = (state: RootState) => state.auth.isSuccess;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;

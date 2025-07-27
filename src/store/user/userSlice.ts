import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { UserProfile } from "@/types/user";

const CREATE_ENDPOINT = "/api/user/create";
const FETCH_ENDPOINT = "/api/user/me";

interface UserProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
}

const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  isSuccess: false,
  error: null,
};

export const createUserProfile = createAsyncThunk<
  UserProfile,
  Partial<UserProfile>
>("user/createUserProfile", async (profileData, { rejectWithValue }) => {
  const res = await fetch(CREATE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const err = await res.json();
    return rejectWithValue(err.message || "Profile creation failed");
  }
  return (await res.json()) as UserProfile;
});

export const fetchUserProfile = createAsyncThunk<UserProfile | null>(
  "user/fetchUserProfile",
  async (_, { rejectWithValue }) => {
    const res = await fetch(FETCH_ENDPOINT);
    if (!res.ok) {
      return rejectWithValue("Failed to fetch user profile");
    }
    return (await res.json()) as UserProfile;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUserProfile.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(
        createUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile>) => {
          state.isLoading = false;
          state.isSuccess = true;
          state.profile = action.payload;
        }
      )
      .addCase(createUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<UserProfile | null>) => {
          state.isLoading = false;
          state.profile = action.payload;
        }
      )
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) || action.error.message || null;
      });
  },
});

export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserSuccess = (state: RootState) => state.user.isSuccess;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;

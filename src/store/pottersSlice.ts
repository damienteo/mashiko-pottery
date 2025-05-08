import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { Potter } from "@/types/potter";

interface EntityState<T> {
  byId: Record<number, T>;
  allIds: number[];
  loading: boolean;
  error: string | null;
}

const initialState: EntityState<Potter> = {
  byId: {},
  allIds: [],
  loading: false,
  error: null,
};

export const fetchPotters = createAsyncThunk("potters/fetchAll", async () => {
  const res = await fetch("/api/potters");
  return (await res.json()) as Potter[];
});

const pottersSlice = createSlice({
  name: "potters",
  initialState,
  reducers: {
    upsertPotter(state, action: PayloadAction<Potter>) {
      const p = action.payload;
      state.byId[p.id] = p;
      if (!state.allIds.includes(p.id)) state.allIds.push(p.id);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPotters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPotters.fulfilled, (state, { payload }) => {
        state.loading = false;
        payload.forEach((p) => {
          state.byId[p.id] = p;
          if (!state.allIds.includes(p.id)) state.allIds.push(p.id);
        });
      })
      .addCase(fetchPotters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to load potters";
      });
  },
});

export const { upsertPotter } = pottersSlice.actions;
export default pottersSlice.reducer;

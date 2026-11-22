import type { Potter } from '@/types/potter'
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

// Async thunk: fetch a single potter by ID
export const fetchPotterDetails = createAsyncThunk<Potter, string>(
  'potterDetails/fetchById',
  async (id) => {
    const res = await fetch(`/api/potters/${id}`)
    if (!res.ok) throw new Error('Failed to load potter')
    return (await res.json()) as Potter
  }
)

interface PotterDetailsState {
  details: Potter | null
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialState: PotterDetailsState = {
  details: null,
  isLoading: false,
  isSuccess: false,
  error: null,
}

const potterDetailsSlice = createSlice({
  name: 'potterDetails',
  initialState,
  reducers: {
    hydratePotterDetails(state, action: PayloadAction<Potter>) {
      state.details = action.payload
      state.isLoading = false
      state.isSuccess = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPotterDetails.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.error = null
      })
      .addCase(
        fetchPotterDetails.fulfilled,
        (state, action: PayloadAction<Potter>) => {
          state.isLoading = false
          state.isSuccess = true
          state.details = action.payload
        }
      )
      .addCase(fetchPotterDetails.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.error = action.error.message ?? 'Unknown error'
      })
  },
})

export const selectPotterDetails = (state: RootState) =>
  state.potterDetails.details
export const selectPotterDetailsIsLoading = (state: RootState) =>
  state.potterDetails.isLoading
export const selectPotterDetailsIsSuccess = (state: RootState) =>
  state.potterDetails.isSuccess
export const selectPotterDetailsError = (state: RootState) =>
  state.potterDetails.error

export const { hydratePotterDetails } = potterDetailsSlice.actions

export default potterDetailsSlice.reducer

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Potter } from '@/types/potter'
import { fetchPottersList } from '@/store/thunks/fetchPottersList'
import type { PotterFilters, Pagination } from '@/types/common'

const CREATE_ENDPOINT = '/api/admin/potter'
const UPDATE_ENDPOINT = '/api/admin/potter'

interface AdminPotterState {
  potter: Potter | null
  items: Potter[]
  filters: PotterFilters
  pagination: Pagination
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialState: AdminPotterState = {
  potter: null,
  items: [],
  filters: {
    name: null,
    style: null,
    active: null,
  },
  pagination: {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  },
  isLoading: false,
  isSuccess: false,
  error: null,
}

export const createAdminPotter = createAsyncThunk<Potter, Partial<Potter>>(
  'adminPotter/create',
  async (potterData, { rejectWithValue }) => {
    const res = await fetch(CREATE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(potterData),
    })
    if (!res.ok) {
      const err = await res.json()
      return rejectWithValue(err.message || 'Potter creation failed')
    }
    return (await res.json()).potter as Potter
  }
)

export const updateAdminPotter = createAsyncThunk<Potter, Partial<Potter>>(
  'adminPotter/update',
  async (potterData, { rejectWithValue }) => {
    const res = await fetch(UPDATE_ENDPOINT, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(potterData),
    })
    if (!res.ok) {
      const err = await res.json()
      return rejectWithValue(err.message || 'Potter update failed')
    }
    return (await res.json()).potter as Potter
  }
)

export const fetchAdminPotter = createAsyncThunk<Potter, number>(
  'adminPotter/fetch',
  async (potterId, { rejectWithValue }) => {
    const res = await fetch(`/api/potters/${potterId}`)
    if (!res.ok) {
      const err = await res.json()
      return rejectWithValue(err.message || 'Failed to fetch potter')
    }
    return (await res.json()) as Potter
  }
)

export const deleteAdminPotter = createAsyncThunk<number, number>(
  'adminPotter/delete',
  async (potterId, { rejectWithValue }) => {
    const res = await fetch(`/api/admin/potter/${potterId}`, {
      method: 'DELETE',
    })
    if (!res.ok) {
      const err = await res.json()
      return rejectWithValue(err.message || 'Failed to delete potter')
    }
    return potterId
  }
)

const adminPotterSlice = createSlice({
  name: 'adminPotter',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdminPotter.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.error = null
      })
      .addCase(
        createAdminPotter.fulfilled,
        (state, action: PayloadAction<Potter>) => {
          state.isLoading = false
          state.isSuccess = true
          state.potter = action.payload
        }
      )
      .addCase(createAdminPotter.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.error = (action.payload as string) || action.error.message || null
      })
      .addCase(updateAdminPotter.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.error = null
      })
      .addCase(
        updateAdminPotter.fulfilled,
        (state, action: PayloadAction<Potter>) => {
          state.isLoading = false
          state.isSuccess = true
          state.potter = action.payload
        }
      )
      .addCase(updateAdminPotter.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.error = (action.payload as string) || action.error.message || null
      })
      .addCase(fetchAdminPotter.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(
        fetchAdminPotter.fulfilled,
        (state, action: PayloadAction<Potter>) => {
          state.isLoading = false
          state.potter = action.payload
        }
      )
      .addCase(fetchAdminPotter.rejected, (state, action) => {
        state.isLoading = false
        state.error = (action.payload as string) || action.error.message || null
      })
      .addCase(deleteAdminPotter.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteAdminPotter.fulfilled, (state) => {
        state.isLoading = false
        state.potter = null
        state.isSuccess = true
      })
      .addCase(deleteAdminPotter.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.error = (action.payload as string) || action.error.message || null
      })
      .addCase(fetchPottersList.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.error = null
      })
      .addCase(
        fetchPottersList.fulfilled,
        (
          state,
          action: PayloadAction<{
            potters: Potter[]
            filters: PotterFilters
            pagination: Pagination
          }>
        ) => {
          state.isLoading = false
          state.isSuccess = true
          state.items = action.payload.potters
          state.filters = action.payload.filters
          state.pagination = action.payload.pagination
        }
      )
      .addCase(fetchPottersList.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.error = action.error.message ?? 'Unknown error'
      })
  },
})

export const selectAdminPotter = (state: RootState) => state.adminPotter.potter
export const selectAdminPotterLoading = (state: RootState) =>
  state.adminPotter.isLoading
export const selectAdminPotterSuccess = (state: RootState) =>
  state.adminPotter.isSuccess
export const selectAdminPotterError = (state: RootState) =>
  state.adminPotter.error

export const selectAdminPotters = (state: RootState) => state.adminPotter.items
export const selectAdminPotterFilters = (state: RootState) =>
  state.adminPotter.filters
export const selectAdminPotterPagination = (state: RootState) =>
  state.adminPotter.pagination

export default adminPotterSlice.reducer

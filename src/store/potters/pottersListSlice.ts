import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import type { Potter } from '@/types/potter'

import { fetchPottersList } from '../thunks/fetchPottersList'

import type { PotterFilters, Pagination } from '@/types/common'

interface PottersListState {
  items: Potter[]
  filters: PotterFilters
  pagination: Pagination
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialState: PottersListState = {
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

const pottersListSlice = createSlice({
  name: 'pottersList',
  initialState,
  reducers: {
    hydratePottersList(
      state,
      action: PayloadAction<{
        potters: Potter[]
        filters: PotterFilters
        pagination: Pagination
      }>
    ) {
      state.items = action.payload.potters
      state.filters = { ...state.filters, ...action.payload.filters }
      state.pagination = action.payload.pagination
      state.isLoading = false
      state.isSuccess = true
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
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

export const selectAllPotters = (state: RootState) => state.pottersList.items
export const selectPottersListFilters = (state: RootState) =>
  state.pottersList.filters
export const selectPottersListPagination = (state: RootState) =>
  state.pottersList.pagination
export const selectPottersListIsLoading = (state: RootState) =>
  state.pottersList.isLoading
export const selectPottersListIsSuccess = (state: RootState) =>
  state.pottersList.isSuccess
export const selectPottersListError = (state: RootState) =>
  state.pottersList.error

export const { hydratePottersList } = pottersListSlice.actions

export default pottersListSlice.reducer

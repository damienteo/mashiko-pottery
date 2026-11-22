import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { SellerInventoryRow } from '@/types/inventory'

interface SellerInventoryState {
  items: SellerInventoryRow[]
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const initialState: SellerInventoryState = {
  items: [],
  isLoading: false,
  isSuccess: false,
  error: null,
}

// Async thunk to fetch seller inventory from API
export const fetchSellerInventory = createAsyncThunk<
  SellerInventoryRow[],
  void,
  { rejectValue: string }
>('sellerInventory/fetchSellerInventory', async (_, { rejectWithValue }) => {
  try {
    const res = await fetch('/api/seller/inventory')
    if (!res.ok) throw new Error('Failed to fetch inventory')
    return await res.json()
  } catch (error) {
    return rejectWithValue((error as Error).message)
  }
})

const sellerInventorySlice = createSlice({
  name: 'sellerInventory',
  initialState,
  reducers: {
    // setInventory is no longer needed with thunk-based fetching
    addItem(state, action: PayloadAction<SellerInventoryRow>) {
      state.items.push(action.payload)
    },
    updateItem(state, action: PayloadAction<SellerInventoryRow>) {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      )
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerInventory.pending, (state) => {
        state.isLoading = true
        state.isSuccess = false
        state.error = null
      })
      .addCase(fetchSellerInventory.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.items = action.payload
      })
      .addCase(fetchSellerInventory.rejected, (state, action) => {
        state.isLoading = false
        state.isSuccess = false
        state.error = action.payload || 'Unknown error'
      })
  },
})

export const { addItem, updateItem, removeItem } = sellerInventorySlice.actions

export default sellerInventorySlice.reducer

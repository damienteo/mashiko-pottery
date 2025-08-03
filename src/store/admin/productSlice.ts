import type { ProductFilters, Pagination } from "@/types/common";
import { fetchProductsList } from "@/store/thunks/fetchProductsList";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import type { Product } from "@/types/product";

const CREATE_ENDPOINT = "/api/admin/product";
const UPDATE_ENDPOINT = "/api/admin/product";
const DELETE_ENDPOINT = "/api/admin/product";

interface AdminProductState {
  product: Product | null;
  isLoading: boolean;
  isSuccess: boolean;
  error: string | null;
  items: Product[];
  filters: ProductFilters;
  pagination: Pagination;
}

const initialState: AdminProductState = {
  product: null,
  isLoading: false,
  isSuccess: false,
  error: null,
  items: [],
  filters: {
    name: null,
    category: null,
    active: null,
    style: null,
    priceMin: null,
    priceMax: null,
  },
  pagination: {
    limit: 10,
    page: 1,
    total: 0,
    totalPages: 0,
  },
};

export const createAdminProduct = createAsyncThunk<Product, Partial<Product>>(
  "adminProduct/create",
  async (productData, { rejectWithValue }) => {
    const res = await fetch(CREATE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || "Product creation failed");
    }
    return (await res.json()) as Product;
  }
);

export const updateAdminProduct = createAsyncThunk<Product, Partial<Product>>(
  "adminProduct/update",
  async (productData, { rejectWithValue }) => {
    const res = await fetch(UPDATE_ENDPOINT, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productData),
    });
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || "Product update failed");
    }
    return (await res.json()) as Product;
  }
);

export const deleteAdminProduct = createAsyncThunk<{ id: number }, number>(
  "adminProduct/delete",
  async (productId, { rejectWithValue }) => {
    const res = await fetch(DELETE_ENDPOINT, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: productId }),
    });
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || "Product deletion failed");
    }
    return { id: productId };
  }
);

export const fetchAdminProduct = createAsyncThunk<Product, number>(
  "adminProduct/fetch",
  async (productId, { rejectWithValue }) => {
    const res = await fetch(`/api/products/${productId}`);
    if (!res.ok) {
      const err = await res.json();
      return rejectWithValue(err.message || "Failed to fetch product");
    }
    return (await res.json()) as Product;
  }
);

const adminProductSlice = createSlice({
  name: "adminProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAdminProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(createAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(createAdminProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(updateAdminProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(updateAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(updateAdminProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(deleteAdminProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(deleteAdminProduct.fulfilled, (state) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = null;
      })
      .addCase(deleteAdminProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(fetchAdminProduct.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(fetchAdminProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.product = action.payload;
      })
      .addCase(fetchAdminProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = (action.payload as string) || action.error.message || null;
      })
      .addCase(fetchProductsList.pending, (state) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.error = null;
      })
      .addCase(fetchProductsList.fulfilled, (state, action: PayloadAction<{
        products: Product[];
        filters: ProductFilters;
        pagination: Pagination;
      }>) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.items = action.payload.products;
        state.filters = action.payload.filters;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProductsList.rejected, (state, action) => {
        state.isLoading = false;
        state.isSuccess = false;
        state.error = action.error.message ?? "Unknown error";
      });
  },
});

export const selectAdminProduct = (state: RootState) => state.adminProduct.product;
export const selectAdminProductLoading = (state: RootState) => state.adminProduct.isLoading;
export const selectAdminProductSuccess = (state: RootState) => state.adminProduct.isSuccess;
export const selectAdminProductError = (state: RootState) => state.adminProduct.error;
export const selectAdminProductItems = (state: RootState) => state.adminProduct.items;
export const selectAdminProductFilters = (state: RootState) => state.adminProduct.filters;
export const selectAdminProductPagination = (state: RootState) => state.adminProduct.pagination;

// Selectors for admin product list (fetchProductsList)
export const selectAdminProductListLoading = (state: RootState) => state.adminProduct.isLoading;
export const selectAdminProductListSuccess = (state: RootState) => state.adminProduct.isSuccess;
export const selectAdminProductListError = (state: RootState) => state.adminProduct.error;
export const selectAdminProductListItems = (state: RootState) => state.adminProduct.items;
export const selectAdminProductListFilters = (state: RootState) => state.adminProduct.filters;
export const selectAdminProductListPagination = (state: RootState) => state.adminProduct.pagination;

export default adminProductSlice.reducer;
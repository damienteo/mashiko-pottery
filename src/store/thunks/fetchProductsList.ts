import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import type { ProductFilters, Pagination } from "@/types/common";

interface FetchParams {
  page?: number;
  limit?: number;
  name?: string;
  category?: string;
  active?: string;
}

export const fetchProductsList = createAsyncThunk<
  { products: Product[]; filters: ProductFilters; pagination: Pagination },
  FetchParams
>("productsList/fetchAll", async (params) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.name) query.set("name", params.name);
  if (params.category) query.set("category", params.category);
  if (params.active) query.set("active", params.active);

  const res = await fetch(`/api/products?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch products");

  const response = await res.json();

  return {
    products: response.products,
    filters: response.filters,
    pagination: response.pagination,
  };
});
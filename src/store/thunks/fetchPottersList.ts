

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Potter } from "@/types/potter";
import type { PotterFilters, Pagination } from "@/types/common";

interface FetchPottersListResponse {
  potters: Potter[];
  filters: PotterFilters;
  pagination: Pagination;
}

interface FetchPottersListParams {
  page?: number;
  limit?: number;
  name?: string;
  active?: string;
}

export const fetchPottersList = createAsyncThunk<
  FetchPottersListResponse,
  FetchPottersListParams
>("pottersList/fetchAll", async (params) => {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.name) query.set("name", params.name);
  if (params.active) query.set("active", params.active);

  const res = await fetch(`/api/potters?${query.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch potters");
  const response = await res.json();
  return {
    potters: response.potters,
    filters: response.filters,
    pagination: response.pagination,
  };
});
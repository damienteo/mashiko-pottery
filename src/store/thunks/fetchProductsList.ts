import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Product } from "@/types/product";
import type { ProductFilters, Pagination } from "@/types/common";

// Args accepted by the thunk
export type FetchProductsArgs = {
  page?: number;
  limit?: number;
  append?: boolean; // hint for reducers to append vs replace
  filters?: Partial<ProductFilters> & {
    // allow simple string params for convenience in callers
    name?: string | null;
    category?: string | null;
    style?: string | null;
    active?: boolean | null;
    priceMin?: number | null;
    priceMax?: number | null;
    potterId?: number | null;
  };
};

const toQuery = (args: FetchProductsArgs) => {
  const params = new URLSearchParams();

  if (typeof args.page === "number") params.set("page", String(args.page));
  if (typeof args.limit === "number") params.set("limit", String(args.limit));

  const f = args.filters ?? {};
  if (f.name) params.set("name", String(f.name));
  if (f.category) params.set("category", String(f.category));
  if (f.style) params.set("style", String(f.style));
  if (typeof f.active === "boolean") params.set("active", String(f.active));
  if (typeof f.priceMin === "number") params.set("priceMin", String(f.priceMin));
  if (typeof f.priceMax === "number") params.set("priceMax", String(f.priceMax));
  if (typeof f.potterId === "number") params.set("potterId", String(f.potterId));

  return params.toString();
};

export const fetchProductsList = createAsyncThunk<
  { products: Product[]; filters: ProductFilters; pagination: Pagination & { append?: boolean } },
  FetchProductsArgs | undefined
>("productsList/fetchAll", async (args = {}, { rejectWithValue }) => {
  const qs = toQuery(args);
  const res = await fetch(`/api/products${qs ? `?${qs}` : ""}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "" } as { message?: string }))
    return rejectWithValue(err.message || "Failed to fetch products");
  }

  const json = await res.json();

  // Normalize API shapes: some endpoints return { items }, others { products }
  const products: Product[] = json.items ?? json.products ?? [];

  const defaultFilters: ProductFilters = {
    name: null,
    category: null,
    active: null,
    style: null,
    priceMin: null,
    priceMax: null,
  };

  const filters: ProductFilters = {
    ...defaultFilters,
    ...(json.filters ?? {}),
  };

  const pagination: Pagination & { append?: boolean } = {
    limit: Number(json.pagination?.limit ?? args.limit ?? 10),
    page: Number(json.pagination?.page ?? args.page ?? 1),
    total: Number(json.pagination?.total ?? 0),
    totalPages: Number(json.pagination?.totalPages ?? 0),
    append: args.append,
  };

  return { products, filters, pagination };
});
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
    q?: string | null;
    locale?: "en" | "ja" | "zh" | null;
  };
};

const toQuery = (args: FetchProductsArgs) => {
  const params = new URLSearchParams();

  if (typeof args.page === "number") params.set("page", String(args.page));
  if (typeof args.limit === "number") params.set("limit", String(args.limit));

  const f = args.filters ?? {};
  // Prefer `q` (canonical). Fallback to legacy `name`.
  const qValue = (typeof f.q === "string" ? f.q : undefined) ?? (typeof f.name === "string" ? f.name : undefined);
  if (qValue) params.set("q", String(qValue));
  if (f.category) params.set("category", String(f.category));
  if (f.style) params.set("style", String(f.style));
  if (typeof f.active === "boolean") params.set("active", String(f.active));
  if (typeof f.priceMin === "number") params.set("priceMin", String(f.priceMin));
  if (typeof f.priceMax === "number") params.set("priceMax", String(f.priceMax));
  if (typeof f.potterId === "number") params.set("potterId", String(f.potterId));
  if (f.locale) params.set("locale", String(f.locale));

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
    name: null,          // retained for UI compatibility; server uses `q`
    category: null,
    active: null,
    style: null,
    priceMin: null,
    priceMax: null,
    potterId: null,
    locale: null,
  };

  const filters: ProductFilters = {
    ...defaultFilters,
    ...(json.filters ?? {}),
  };
  // Normalize search key: prefer q from server, but keep `name` for UI code expecting it.
  if (!filters.name && (json.filters?.name || json.filters?.q)) {
    filters.name = (json.filters?.q ?? json.filters?.name) ?? null;
  }
  // Also surface locale if present
  if (json.filters?.locale) {
    filters.locale = json.filters.locale;
  }

  const pagination: Pagination & { append?: boolean } = {
    limit: Number(json.pagination?.limit ?? args.limit ?? 10),
    page: Number(json.pagination?.page ?? args.page ?? 1),
    total: Number(json.pagination?.total ?? 0),
    totalPages: Number(json.pagination?.totalPages ?? 0),
    append: args.append,
  };
console.log({filters})
  return { products, filters, pagination };
});
export interface BaseFilters {
  name: string | null;
  active: boolean | null;
}

export interface ProductFilters extends BaseFilters {
  category: string | null;
  style: string | null;
  priceMin: number | null;
  priceMax: number | null;
  potterId?: number | null;
}

export interface PotterFilters extends BaseFilters {
  style: string | null;
}

export interface Pagination {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

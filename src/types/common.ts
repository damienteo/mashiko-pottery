export interface BaseFilters {
  name?: string | null
  active: boolean | null
}

export interface ProductFilters extends BaseFilters {
  /**
   * Canonical search term for products.
   * Replaces 'name' as the standard search property.
   */
  q?: string | null
  locale?: 'en' | 'ja' | 'zh' | null
  category: string | null
  style: string | null
  priceMin: number | null
  priceMax: number | null
  potterId?: number | null
}

export interface PotterFilters extends BaseFilters {
  style: string | null
}

export interface Pagination {
  limit: number
  page: number
  total: number
  totalPages: number
}

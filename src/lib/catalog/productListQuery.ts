import type { Pagination, ProductFilters } from '@/types/common'
import type { Locale } from '@/types/i18n'
import type { Product } from '@/types/product'

export type ProductListPayload = {
  products: Product[]
  filters: ProductFilters
  pagination: Pagination
}

export const emptyProductFilters = (): ProductFilters => ({
  name: null,
  q: null,
  locale: null,
  category: null,
  style: null,
  active: null,
  priceMin: null,
  priceMax: null,
  potterId: null,
})

type SearchParamsLike = {
  get: (name: string) => string | null
  toString: () => string
}

export type ParsedProductListQuery = {
  hasQuery: boolean
  page: number
  limit: number
  filters: Partial<ProductFilters>
}

function num(value: string | null): number | undefined {
  if (value == null) return undefined
  const n = Number(value)
  return Number.isNaN(n) ? undefined : n
}

function bool(value: string | null): boolean | undefined {
  if (value == null) return undefined
  return value === 'true' || value === '1'
}

export function parseProductListSearchParams(
  searchParams: SearchParamsLike,
  fallbackLocale: Locale,
  defaults: { page: number; limit: number } = { page: 1, limit: 10 }
): ParsedProductListQuery {
  const pageParam = num(searchParams.get('page'))
  const limitParam = num(searchParams.get('limit'))
  const priceMinParam = num(searchParams.get('priceMin'))
  const priceMaxParam = num(searchParams.get('priceMax'))
  const potterIdParam = num(searchParams.get('potterId'))
  const urlLocale =
    (searchParams.get('locale') as Locale | null) ?? fallbackLocale

  return {
    hasQuery: searchParams.toString().length > 0,
    page: pageParam && pageParam > 0 ? pageParam : defaults.page,
    limit: limitParam && limitParam > 0 ? limitParam : defaults.limit,
    filters: {
      category: searchParams.get('category') || null,
      style: searchParams.get('style') || null,
      priceMin: priceMinParam ?? null,
      priceMax: priceMaxParam ?? null,
      active: bool(searchParams.get('active')) ?? null,
      potterId: potterIdParam ?? null,
      q: searchParams.get('q') || null,
      locale: urlLocale,
    },
  }
}

export function toProductListQueryString(args: {
  page?: number
  limit?: number
  filters?: Partial<ProductFilters>
}): string {
  const params = new URLSearchParams()
  if (typeof args.page === 'number') params.set('page', String(args.page))
  if (typeof args.limit === 'number') params.set('limit', String(args.limit))

  const f = args.filters ?? {}
  const qValue =
    (typeof f.q === 'string' ? f.q : undefined) ??
    (typeof f.name === 'string' ? f.name : undefined)
  if (qValue) params.set('q', qValue)
  if (f.category) params.set('category', f.category)
  if (f.style) params.set('style', f.style)
  if (typeof f.active === 'boolean') params.set('active', String(f.active))
  if (typeof f.priceMin === 'number') params.set('priceMin', String(f.priceMin))
  if (typeof f.priceMax === 'number') params.set('priceMax', String(f.priceMax))
  if (typeof f.potterId === 'number') params.set('potterId', String(f.potterId))
  if (f.locale) params.set('locale', f.locale)
  return params.toString()
}

export function productListResultFromApiJson(
  json: {
    items?: Product[]
    products?: Product[]
    filters?: Partial<ProductFilters> & { q?: string | null }
    pagination?: Partial<Pagination>
  },
  args: { page?: number; limit?: number }
): ProductListPayload {
  const products = json.items ?? json.products ?? []
  const filters: ProductFilters = {
    ...emptyProductFilters(),
    ...(json.filters ?? {}),
  }
  if (!filters.q && (json.filters?.q || json.filters?.name)) {
    filters.q = json.filters?.q ?? json.filters?.name ?? null
  }
  if (!filters.name) {
    filters.name = filters.q
  }
  return {
    products,
    filters,
    pagination: {
      limit: Number(json.pagination?.limit ?? args.limit ?? 10),
      page: Number(json.pagination?.page ?? args.page ?? 1),
      total: Number(json.pagination?.total ?? 0),
      totalPages: Number(json.pagination?.totalPages ?? 0),
    },
  }
}

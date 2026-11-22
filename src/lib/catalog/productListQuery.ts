import type { ProductFilters } from '@/types/common'
import type { Locale } from '@/types/i18n'

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

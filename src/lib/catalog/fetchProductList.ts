import {
  productListResultFromApiJson,
  toProductListQueryString,
} from '@/lib/catalog/productListQuery'
import type { ProductFilters } from '@/types/common'
import type { ProductListPayload } from '@/lib/catalog/productListQuery'

export async function fetchProductListFromApi(args: {
  page: number
  limit: number
  filters: Partial<ProductFilters>
}): Promise<ProductListPayload> {
  const qs = toProductListQueryString(args)
  const res = await fetch(`/api/products${qs ? `?${qs}` : ''}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: '' }))
    throw new Error(
      typeof err.message === 'string' && err.message
        ? err.message
        : 'Failed to fetch products'
    )
  }
  const json = await res.json()
  return productListResultFromApiJson(json, args)
}

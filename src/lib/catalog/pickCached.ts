import type { Pagination, ProductFilters } from '@/types/common'
import type { Product } from '@/types/product'

export type ProductListSnapshot = {
  products: Product[]
  filters: ProductFilters
  pagination: Pagination
}

export function pickById<T extends { id: number }>(
  store: T | null | undefined,
  initial: T | null | undefined,
  currentId: number | null
): T | null {
  if (currentId == null || Number.isNaN(currentId)) {
    return initial ?? null
  }
  if (initial?.id === currentId) return initial
  if (store?.id === currentId) return store
  return null
}

function potterIdOf(list: ProductListSnapshot): number | null {
  return list.filters.potterId ?? null
}

/**
 * Prefer the RSC `initial` list when it matches the page's potter scope so
 * SSR and the first client paint agree. Use the singleton store only when it
 * is for the same potter (catalog pages use `null`).
 */
export function pickScopedProductList({
  store,
  initial,
  expectedPotterId,
  storeReady,
}: {
  store: ProductListSnapshot
  initial: ProductListSnapshot | null
  expectedPotterId: number | null
  storeReady: boolean
}): ProductListSnapshot | null {
  const storeMatches = potterIdOf(store) === expectedPotterId
  if (storeReady && storeMatches) return store
  if (initial && potterIdOf(initial) === expectedPotterId) return initial
  return initial
}

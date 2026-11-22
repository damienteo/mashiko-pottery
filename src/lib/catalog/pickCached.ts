import type { Pagination, ProductFilters, PotterFilters } from '@/types/common'
import type { Product } from '@/types/product'
import type { Potter } from '@/types/potter'

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

export type PotterListSnapshot = {
  potters: Potter[]
  filters: PotterFilters
  pagination: Pagination
}

function samePotterFilters(a: PotterFilters, b: PotterFilters): boolean {
  return (
    (a.name ?? null) === (b.name ?? null) &&
    (a.style ?? null) === (b.style ?? null) &&
    (a.active ?? null) === (b.active ?? null)
  )
}

/**
 * Prefer the RSC `initial` potter list when the singleton store was filled
 * by a different query. Use the store only once its filters match.
 */
export function pickScopedPotterList({
  store,
  initial,
  expectedFilters,
  storeReady,
}: {
  store: PotterListSnapshot
  initial: PotterListSnapshot | null
  expectedFilters: PotterFilters
  storeReady: boolean
}): PotterListSnapshot | null {
  const storeMatches = samePotterFilters(store.filters, expectedFilters)
  if (storeReady && storeMatches) return store
  if (initial && samePotterFilters(initial.filters, expectedFilters)) {
    return initial
  }
  return initial
}

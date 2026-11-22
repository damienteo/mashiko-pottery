import { pickById, pickScopedProductList } from '@/lib/catalog/pickCached'
import type { Product } from '@/types/product'
import type { ProductFilters, Pagination } from '@/types/common'

const filters = (potterId: number | null): ProductFilters => ({
  name: null,
  q: null,
  locale: null,
  category: null,
  style: null,
  active: null,
  priceMin: null,
  priceMax: null,
  potterId,
})

const pagination = (page: number): Pagination => ({
  page,
  limit: 10,
  total: 1,
  totalPages: 1,
})

const product = (id: number): Product => ({
  id,
  potterId: 1,
  title: { en: `p${id}`, ja: `p${id}`, zh: `p${id}` },
  description: { en: '', ja: '', zh: '' },
  price: 1,
  stock: 1,
  photos: [],
  tags: [],
  isDraft: false,
})

describe('pickById', () => {
  it('prefers matching initial props over a stale store entity', () => {
    expect(pickById(product(1), product(2), 2)?.id).toBe(2)
  })

  it('uses the store only when it matches the current id', () => {
    expect(pickById(product(2), product(1), 2)?.id).toBe(2)
    expect(pickById(product(9), product(1), 2)).toBeNull()
    expect(pickById(product(9), null, 2)).toBeNull()
  })
})

describe('pickScopedProductList', () => {
  const catalog = {
    products: [product(1)],
    filters: filters(null),
    pagination: pagination(1),
  }
  const related = {
    products: [product(8)],
    filters: filters(3),
    pagination: pagination(1),
  }

  it('does not let a potter-scoped store leak onto the catalog page', () => {
    const picked = pickScopedProductList({
      store: related,
      initial: catalog,
      expectedPotterId: null,
      storeReady: true,
    })
    expect(picked?.products[0]?.id).toBe(1)
  })

  it('uses the store for catalog updates once it matches', () => {
    const page2 = {
      products: [product(4)],
      filters: filters(null),
      pagination: pagination(2),
    }
    const picked = pickScopedProductList({
      store: page2,
      initial: catalog,
      expectedPotterId: null,
      storeReady: true,
    })
    expect(picked?.pagination.page).toBe(2)
    expect(picked?.products[0]?.id).toBe(4)
  })

  it('prefers initial on first paint when the store is not ready', () => {
    const picked = pickScopedProductList({
      store: related,
      initial: catalog,
      expectedPotterId: null,
      storeReady: false,
    })
    expect(picked?.products[0]?.id).toBe(1)
  })
})

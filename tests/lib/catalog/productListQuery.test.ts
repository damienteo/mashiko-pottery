import {
  parseProductListSearchParams,
  productListResultFromApiJson,
  toProductListQueryString,
} from '@/lib/catalog/productListQuery'

function params(query: string) {
  return new URLSearchParams(query)
}

describe('parseProductListSearchParams', () => {
  it('treats an empty query as the prerendered first page', () => {
    const parsed = parseProductListSearchParams(params(''), 'ja')
    expect(parsed.hasQuery).toBe(false)
    expect(parsed.page).toBe(1)
    expect(parsed.limit).toBe(10)
    expect(parsed.filters.locale).toBe('ja')
  })

  it('reads pagination, text search, and filters from the query string', () => {
    const parsed = parseProductListSearchParams(
      params(
        'page=2&limit=20&q=donabe&category=bowl&style=shino&priceMin=1000&priceMax=5000&active=true&potterId=3&locale=en'
      ),
      'ja'
    )
    expect(parsed.hasQuery).toBe(true)
    expect(parsed.page).toBe(2)
    expect(parsed.limit).toBe(20)
    expect(parsed.filters).toEqual({
      category: 'bowl',
      style: 'shino',
      priceMin: 1000,
      priceMax: 5000,
      active: true,
      potterId: 3,
      q: 'donabe',
      locale: 'en',
    })
  })

  it('serializes list queries without empty filter keys', () => {
    expect(
      toProductListQueryString({
        page: 2,
        limit: 20,
        filters: {
          q: 'donabe',
          category: 'bowl',
          locale: 'ja',
          potterId: 3,
        },
      })
    ).toBe('page=2&limit=20&q=donabe&category=bowl&potterId=3&locale=ja')
  })

  it('normalizes API list JSON into the catalog payload', () => {
    const result = productListResultFromApiJson(
      {
        items: [],
        filters: { q: 'cup', name: null, category: 'cup' },
        pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
      },
      { page: 1, limit: 10 }
    )
    expect(result.filters.q).toBe('cup')
    expect(result.filters.name).toBe('cup')
    expect(result.pagination.total).toBe(0)
  })
})

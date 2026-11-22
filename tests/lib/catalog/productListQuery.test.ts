import { parseProductListSearchParams } from '@/lib/catalog/productListQuery'

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
})

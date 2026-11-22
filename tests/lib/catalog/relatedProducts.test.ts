import { pickRelatedProducts } from '@/lib/catalog/relatedProducts'
import type { Product } from '@/types/product'

function product(id: number): Product {
  return {
    id,
    potterId: 1,
    title: { en: `p${id}`, ja: `p${id}`, zh: `p${id}` },
    description: { en: '', ja: '', zh: '' },
    price: id,
    photos: [],
    tags: [],
    isDraft: false,
  }
}

describe('pickRelatedProducts', () => {
  const catalog = [1, 2, 3, 4, 5].map(product)

  it('excludes the current product and caps the list', () => {
    const related = pickRelatedProducts(catalog, 3, 2, '2026-01-01')
    expect(related).toHaveLength(2)
    expect(related.map((p) => p.id)).not.toContain(3)
  })

  it('is stable for a given day stamp', () => {
    const a = pickRelatedProducts(catalog, 1, 8, '2026-01-01').map((p) => p.id)
    const b = pickRelatedProducts(catalog, 1, 8, '2026-01-01').map((p) => p.id)
    expect(a).toEqual(b)
  })
})

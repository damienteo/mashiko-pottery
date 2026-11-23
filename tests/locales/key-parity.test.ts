import { readFileSync, readdirSync } from 'fs'
import { join } from 'path'
import { PRODUCT_CATEGORIES } from '@/constants/productCategories'

const localesDir = join(process.cwd(), 'src/locales')
const locales = ['ja', 'en', 'zh'] as const

function collectKeys(value: unknown, prefix = ''): string[] {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return Object.entries(value as Record<string, unknown>).flatMap(
      ([key, nested]) => collectKeys(nested, prefix ? `${prefix}.${key}` : key)
    )
  }
  return prefix ? [prefix] : []
}

function load(locale: string, file: string): Record<string, unknown> {
  return JSON.parse(
    readFileSync(join(localesDir, locale, file), 'utf8')
  ) as Record<string, unknown>
}

describe('locale key parity', () => {
  const files = readdirSync(join(localesDir, 'en')).filter((name) =>
    name.endsWith('.json')
  )

  it('has the same message files in ja, en, and zh', () => {
    for (const locale of locales) {
      const names = readdirSync(join(localesDir, locale)).filter((name) =>
        name.endsWith('.json')
      )
      expect(names.sort()).toEqual([...files].sort())
    }
  })

  it.each(['products.json', 'product.json', 'potter.json', 'potters.json'])(
    'keeps %s keys aligned across locales',
    (file) => {
      const enKeys = collectKeys(load('en', file)).sort()
      expect(collectKeys(load('ja', file)).sort()).toEqual(enKeys)
      expect(collectKeys(load('zh', file)).sort()).toEqual(enKeys)
    }
  )

  it('adds meta.products title and description in every locale', () => {
    for (const locale of locales) {
      const meta = load(locale, 'meta.json') as {
        products?: { title?: string; description?: string }
      }
      expect(meta.products?.title).toEqual(expect.any(String))
      expect(meta.products?.description).toEqual(expect.any(String))
    }
  })

  it('has translated labels for every product category in ja, en, and zh', () => {
    for (const locale of locales) {
      const products = load(locale, 'products.json') as {
        categories?: Record<string, string>
      }
      expect(Object.keys(products.categories ?? {}).sort()).toEqual(
        [...PRODUCT_CATEGORIES].sort()
      )
      for (const key of PRODUCT_CATEGORIES) {
        expect(products.categories?.[key]).toEqual(expect.any(String))
        expect(products.categories?.[key]?.length).toBeGreaterThan(0)
      }
    }
  })

  it('translates gallery and sold-out labels in every locale', () => {
    for (const locale of locales) {
      const common = load(locale, 'common.json') as {
        gallery?: { selectImage?: string }
      }
      const product = load(locale, 'product.json') as {
        soldOut?: string
        works?: string
        worksBy?: string
      }
      expect(common.gallery?.selectImage).toMatch(/\{n\}/)
      expect(product.soldOut).toEqual(expect.any(String))
      expect(product.works).toEqual(expect.any(String))
      expect(product.worksBy).toMatch(/\{name\}/)
    }
  })
})

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const LOCALES = ['ja', 'en', 'zh'] as const
const LOCALES_ROOT = join(process.cwd(), 'src/locales')
const HOME_FILES = [
  'featured.json',
  'home.json',
  'howItWorks.json',
  'newsletter.json',
  'potterSpotlights.json',
  'shippingGuarantee.json',
  'testimonials.json',
]

function flattenKeys(value: unknown, prefix = ''): string[] {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return prefix ? [prefix] : []
  }
  return Object.entries(value as Record<string, unknown>).flatMap(
    ([key, nested]) => {
      const path = prefix ? `${prefix}.${key}` : key
      if (
        nested !== null &&
        typeof nested === 'object' &&
        !Array.isArray(nested)
      ) {
        return flattenKeys(nested, path)
      }
      return [path]
    }
  )
}

function readLocaleJson(locale: string, file: string) {
  return JSON.parse(
    readFileSync(join(LOCALES_ROOT, locale, file), 'utf8')
  ) as unknown
}

describe('locale key parity', () => {
  it('has the same JSON files in ja, en, and zh', () => {
    const jaFiles = readdirSync(join(LOCALES_ROOT, 'ja'))
      .filter((name) => name.endsWith('.json'))
      .sort()
    for (const locale of LOCALES) {
      const names = readdirSync(join(LOCALES_ROOT, locale))
        .filter((name) => name.endsWith('.json'))
        .sort()
      expect(names).toEqual(jaFiles)
    }
  })

  it.each(HOME_FILES)('matches keys for %s across ja/en/zh', (file) => {
    const jaKeys = flattenKeys(readLocaleJson('ja', file)).sort()
    for (const locale of ['en', 'zh'] as const) {
      expect(flattenKeys(readLocaleJson(locale, file)).sort()).toEqual(jaKeys)
    }
  })

  it('does not keep seasonal or refund-guarantee home copy', () => {
    const featured = JSON.stringify(readLocaleJson('en', 'featured.json'))
    const shipping = JSON.stringify(
      readLocaleJson('en', 'shippingGuarantee.json')
    )
    const home = JSON.stringify(readLocaleJson('en', 'home.json'))
    expect(featured).not.toMatch(/2025/)
    expect(featured).not.toMatch(/Autumn Festival/i)
    expect(shipping).not.toMatch(/5 business days/i)
    expect(shipping).not.toMatch(/money back/i)
    expect(home).not.toMatch(/[\u{1F300}-\u{1FAFF}]/u)
  })
})

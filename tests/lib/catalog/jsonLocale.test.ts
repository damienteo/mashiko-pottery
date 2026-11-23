import { whereJsonLocaleContains } from '@/lib/catalog/jsonLocale'

describe('whereJsonLocaleContains', () => {
  it('matches style text in en, ja, and zh', () => {
    expect(whereJsonLocaleContains('style', 'oribe')).toEqual({
      OR: [
        { style: { path: ['en'], string_contains: 'oribe' } },
        { style: { path: ['ja'], string_contains: 'oribe' } },
        { style: { path: ['zh'], string_contains: 'oribe' } },
      ],
    })
  })
})

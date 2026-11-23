import {
  asLocalized,
  localizedText,
  serializePotter,
} from '@/lib/catalog/serialize'

const jsonbStyle = {
  en: 'Yakishime (unglazed, wood-fired)',
  ja: '焼締め',
  zh: '烧缔（无釉柴烧）',
}

describe('serializePotter style', () => {
  it('keeps null style as undefined', () => {
    const potter = serializePotter({
      id: 1,
      name: { en: 'A', ja: 'ア', zh: 'A' },
      bio: { en: '', ja: '', zh: '' },
      style: null,
      active: true,
      photos: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDraft: false,
    })
    expect(potter.style).toBeUndefined()
  })

  it('maps a jsonb style object', () => {
    const potter = serializePotter({
      id: 1,
      name: { en: 'A', ja: 'ア', zh: 'A' },
      bio: { en: '', ja: '', zh: '' },
      style: jsonbStyle,
      active: true,
      photos: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDraft: false,
    })
    expect(potter.style).toEqual(jsonbStyle)
    expect(localizedText(potter.style, 'ja')).toBe('焼締め')
    expect(localizedText(potter.style, 'ja')).not.toMatch(/\{/)
  })

  it('parses a stringified jsonb object (pg/json text)', () => {
    const potter = serializePotter({
      id: 1,
      name: { en: 'A', ja: 'ア', zh: 'A' },
      bio: { en: '', ja: '', zh: '' },
      style: JSON.stringify(jsonbStyle),
      active: true,
      photos: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDraft: false,
    })
    expect(potter.style).toEqual(jsonbStyle)
    expect(localizedText(potter.style, 'ja')).toBe('焼締め')
  })

  it('unwraps locale values that are themselves JSON objects', () => {
    const blob = JSON.stringify(jsonbStyle)
    const potter = serializePotter({
      id: 1,
      name: { en: 'A', ja: 'ア', zh: 'A' },
      bio: { en: '', ja: '', zh: '' },
      style: { en: blob, ja: blob, zh: blob },
      active: true,
      photos: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDraft: false,
    })
    expect(potter.style).toEqual(jsonbStyle)
    expect(localizedText(potter.style, 'zh')).toBe('烧缔（无釉柴烧）')
  })

  it('copies a leftover string into all locales', () => {
    const potter = serializePotter({
      id: 1,
      name: { en: 'A', ja: 'ア', zh: 'A' },
      bio: { en: '', ja: '', zh: '' },
      style: 'Pending',
      active: true,
      photos: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDraft: false,
    })
    expect(potter.style).toEqual({
      en: 'Pending',
      ja: 'Pending',
      zh: 'Pending',
    })
  })
})

describe('localizedText', () => {
  const style = { en: 'Yakishime', ja: '焼き締め', zh: '烧締め' }

  it('picks the visitor locale', () => {
    expect(localizedText(style, 'zh')).toBe('烧締め')
  })

  it('falls back ja then en then zh', () => {
    expect(localizedText({ en: 'EN', ja: 'JA', zh: '' }, 'fr')).toBe('JA')
    expect(localizedText({ en: 'EN', ja: '', zh: 'ZH' }, 'fr')).toBe('EN')
    expect(localizedText({ en: '', ja: '', zh: 'ZH' }, 'fr')).toBe('ZH')
  })

  it('returns empty for missing or empty values', () => {
    expect(localizedText(undefined, 'ja')).toBe('')
    expect(localizedText({ en: '', ja: '', zh: '' }, 'ja')).toBe('')
  })

  it('does not render raw JSON when given a jsonb object string', () => {
    const raw = JSON.stringify(jsonbStyle)
    expect(localizedText(raw, 'ja')).toBe('焼締め')
    expect(localizedText(raw, 'en')).toBe('Yakishime (unglazed, wood-fired)')
    expect(localizedText(raw, 'ja')).not.toContain('"en"')
  })
})

describe('asLocalized', () => {
  it('hides empty objects as empty strings', () => {
    expect(asLocalized({})).toEqual({ en: '', ja: '', zh: '' })
    expect(asLocalized(null)).toEqual({ en: '', ja: '', zh: '' })
  })
})

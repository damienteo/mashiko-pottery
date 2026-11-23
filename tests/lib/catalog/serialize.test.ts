import { localizedText, serializePotter } from '@/lib/catalog/serialize'

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
      style: { en: 'Yakishime', ja: '焼き締め', zh: '烧締め' },
      active: true,
      photos: [],
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      isDraft: false,
    })
    expect(potter.style).toEqual({
      en: 'Yakishime',
      ja: '焼き締め',
      zh: '烧締め',
    })
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
})

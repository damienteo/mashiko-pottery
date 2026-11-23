import {
  documentTitle,
  isNonEmptyText,
  trimAtBoundary,
} from '@/lib/catalog/trimAtBoundary'

describe('trimAtBoundary', () => {
  it('returns short text unchanged', () => {
    expect(trimAtBoundary('Handmade cup.', 150)).toBe('Handmade cup.')
  })

  it('trims at the last sentence boundary and adds an ellipsis', () => {
    const text =
      'First sentence is complete. Second sentence keeps going without a later stop and then some more words to exceed the limit of one hundred fifty characters in total here.'
    const result = trimAtBoundary(text, 150)
    expect(result.endsWith('…')).toBe(true)
    expect(result).toContain('First sentence is complete.')
    expect(result.length).toBeLessThanOrEqual(151)
  })

  it('falls back to a word boundary when there is no sentence end', () => {
    const text =
      'Handmade Mashiko pottery from local artisans with careful forming trimming glazing and wood firing details throughout each piece'
    const result = trimAtBoundary(text, 40)
    const body = result.slice(0, -1)
    expect(result.endsWith('…')).toBe(true)
    expect(text.startsWith(body)).toBe(true)
    expect(text[body.length]).toBe(' ')
  })

  it('cuts CJK without spaces at max length', () => {
    const text = '益子焼の手作り作品を地元の職人とともに丁寧にお届けします'
    const result = trimAtBoundary(text, 10)
    expect(result).toBe(`${text.slice(0, 10)}…`)
  })
})

describe('isNonEmptyText', () => {
  it('rejects empty and whitespace-only values', () => {
    expect(isNonEmptyText('')).toBe(false)
    expect(isNonEmptyText('   ')).toBe(false)
    expect(isNonEmptyText(undefined)).toBe(false)
    expect(isNonEmptyText('oribe')).toBe(true)
  })
})

describe('documentTitle', () => {
  it('joins the page title with the brand suffix', () => {
    expect(documentTitle('Cup', 'Mashiko Pottery')).toBe(
      'Cup – Mashiko Pottery'
    )
  })

  it('returns the brand when the page title is empty', () => {
    expect(documentTitle('  ', 'Mashiko Pottery')).toBe('Mashiko Pottery')
  })
})

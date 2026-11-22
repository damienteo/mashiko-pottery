import { isSafeRelativeCallback, parseCallbackParam } from '@/lib/i18n/callback'

describe('isSafeRelativeCallback', () => {
  it('accepts same-site relative paths with search', () => {
    expect(isSafeRelativeCallback('/ja/admin/products?tab=1')).toBe(true)
    expect(isSafeRelativeCallback('/en/profile')).toBe(true)
    expect(isSafeRelativeCallback('/ja/admin?x=1')).toBe(true)
  })

  it('rejects open redirects', () => {
    expect(isSafeRelativeCallback('https://evil.example/phish')).toBe(false)
    expect(isSafeRelativeCallback('//evil.example/phish')).toBe(false)
    expect(isSafeRelativeCallback('/\\evil.example')).toBe(false)
    expect(isSafeRelativeCallback('/\\evil')).toBe(false)
    expect(isSafeRelativeCallback('javascript:alert(1)')).toBe(false)
    expect(isSafeRelativeCallback('%2F%2Fevil')).toBe(false)
  })

  it('rejects ASCII whitespace and control characters, raw or encoded', () => {
    expect(isSafeRelativeCallback('/%09//evil.example')).toBe(false)
    expect(isSafeRelativeCallback('/\t//evil.example')).toBe(false)
    expect(isSafeRelativeCallback('/%0a//evil')).toBe(false)
    expect(isSafeRelativeCallback('/\n//evil')).toBe(false)
    expect(isSafeRelativeCallback('/%0d//evil.example')).toBe(false)
    expect(isSafeRelativeCallback('/ foo')).toBe(false)
  })
})

describe('parseCallbackParam', () => {
  it('falls back when missing or unsafe', () => {
    expect(parseCallbackParam(undefined, '/ja')).toBe('/ja')
    expect(parseCallbackParam('https://evil.example', '/ja')).toBe('/ja')
    expect(parseCallbackParam('/%09//evil.example', '/ja')).toBe('/ja')
    expect(parseCallbackParam('/\t//evil.example', '/ja')).toBe('/ja')
    expect(parseCallbackParam('/%0a//evil', '/ja')).toBe('/ja')
    expect(parseCallbackParam('%2F%2Fevil', '/ja')).toBe('/ja')
    expect(parseCallbackParam('/\\evil', '/ja')).toBe('/ja')
  })

  it('decodes a relative callback', () => {
    expect(parseCallbackParam('%2Fja%2Fseller', '/ja')).toBe('/ja/seller')
    expect(parseCallbackParam('/ja/admin?x=1', '/ja')).toBe('/ja/admin?x=1')
  })
})

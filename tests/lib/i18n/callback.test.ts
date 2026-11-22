import { isSafeRelativeCallback, parseCallbackParam } from '@/lib/i18n/callback'

describe('isSafeRelativeCallback', () => {
  it('accepts same-site relative paths with search', () => {
    expect(isSafeRelativeCallback('/ja/admin/products?tab=1')).toBe(true)
    expect(isSafeRelativeCallback('/en/profile')).toBe(true)
  })

  it('rejects open redirects', () => {
    expect(isSafeRelativeCallback('https://evil.example/phish')).toBe(false)
    expect(isSafeRelativeCallback('//evil.example/phish')).toBe(false)
    expect(isSafeRelativeCallback('/\\evil.example')).toBe(false)
    expect(isSafeRelativeCallback('javascript:alert(1)')).toBe(false)
  })
})

describe('parseCallbackParam', () => {
  it('falls back when missing or unsafe', () => {
    expect(parseCallbackParam(undefined, '/ja')).toBe('/ja')
    expect(parseCallbackParam('https://evil.example', '/ja')).toBe('/ja')
  })

  it('decodes a relative callback', () => {
    expect(parseCallbackParam('%2Fja%2Fseller', '/ja')).toBe('/ja/seller')
  })
})

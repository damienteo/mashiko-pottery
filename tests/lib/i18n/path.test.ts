import { isProtectedPath, isSessionRequiredPath } from '@/lib/i18n/path'

describe('isSessionRequiredPath', () => {
  it.each([
    '/admin',
    '/ja/admin',
    '/en/admin/products',
    '/seller',
    '/zh/seller/inventory',
    '/profile',
    '/ja/profile',
    '/login',
    '/en/login',
    '/register',
    '/ja/register/entry',
    '/register/email-sent',
  ])('requires a session on %s', (path) => {
    expect(isSessionRequiredPath(path)).toBe(true)
  })

  it.each([
    '/',
    '/ja',
    '/en/products',
    '/ja/products/1',
    '/zh/potters',
    '/api/products',
  ])('skips Supabase on %s', (path) => {
    expect(isSessionRequiredPath(path)).toBe(false)
  })
})

describe('isProtectedPath', () => {
  it.each([
    '/admin',
    '/ja/admin/potters',
    '/seller',
    '/en/seller/profile',
    '/profile',
    '/zh/profile',
  ])('redirects unauthenticated visitors from %s', (path) => {
    expect(isProtectedPath(path)).toBe(true)
  })

  it.each(['/login', '/ja/login', '/register/entry', '/ja/products', '/ja'])(
    'does not redirect %s',
    (path) => {
      expect(isProtectedPath(path)).toBe(false)
    }
  )
})

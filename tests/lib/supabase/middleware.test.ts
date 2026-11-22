import { NextRequest, NextResponse } from 'next/server'

jest.mock('@/i18n/routing', () => ({
  routing: { defaultLocale: 'ja', locales: ['en', 'ja', 'zh'] },
}))

import { copyCookies } from '@/lib/supabase/cookies'
import {
  unauthenticatedLoginUrl,
  updateSession,
} from '@/lib/supabase/middleware'

const setAll = jest.fn()

jest.mock('@supabase/ssr', () => ({
  createServerClient: (
    _url: string,
    _key: string,
    opts: {
      cookies: {
        setAll: (
          cookies: { name: string; value: string; options: object }[]
        ) => void
      }
    }
  ) => {
    setAll.mockImplementation(
      (cookies: { name: string; value: string; options: object }[]) => {
        opts.cookies.setAll(cookies)
      }
    )
    return {
      auth: {
        getUser: async () => {
          opts.cookies.setAll([
            {
              name: 'sb-access-token',
              value: 'refreshed',
              options: { path: '/' },
            },
          ])
          return {
            data: {
              user:
                (globalThis as { __supabaseUser?: { id: string } | null })
                  .__supabaseUser ?? null,
            },
            error: null,
          }
        },
      },
    }
  },
}))

function request(path: string) {
  return new NextRequest(`http://localhost:3000${path}`)
}

describe('unauthenticatedLoginUrl', () => {
  it('sets a same-site callback to the original path and search', () => {
    const url = unauthenticatedLoginUrl(request('/ja/admin/products?tab=stock'))
    expect(url.pathname).toBe('/ja/login')
    expect(url.searchParams.get('callback')).toBe(
      '/ja/admin/products?tab=stock'
    )
  })
})

describe('copyCookies', () => {
  it('copies cookies onto a new response', () => {
    const from = NextResponse.next()
    from.cookies.set('sb-access-token', 'refreshed', { path: '/' })
    const to = NextResponse.redirect('http://localhost:3000/ja/login')
    copyCookies(from, to)
    expect(to.cookies.get('sb-access-token')?.value).toBe('refreshed')
  })
})

describe('updateSession', () => {
  const originalUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const originalKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
    ;(globalThis as { __supabaseUser?: { id: string } | null }).__supabaseUser =
      null
  })

  afterEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = originalUrl
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalKey
  })

  it('copies getUser cookies onto the login redirect and sets callback', async () => {
    const response = await updateSession(request('/en/seller/inventory'))
    expect(response.status).toBe(307)
    const location = response.headers.get('location') ?? ''
    expect(location).toContain('/en/login')
    expect(location).toContain(
      `callback=${encodeURIComponent('/en/seller/inventory')}`
    )
    expect(response.cookies.get('sb-access-token')?.value).toBe('refreshed')
  })

  it('keeps getUser cookies on the non-redirect response', async () => {
    ;(globalThis as { __supabaseUser?: { id: string } | null }).__supabaseUser =
      { id: 'user-1' }
    const response = await updateSession(request('/ja/seller/inventory'))
    expect(response.headers.get('location')).toBeNull()
    expect(response.cookies.get('sb-access-token')?.value).toBe('refreshed')
  })
})

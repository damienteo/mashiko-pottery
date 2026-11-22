import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import { updateSession } from './lib/supabase/middleware'

const LOCALE_MAP: Record<string, string> = {
  'zh-CN': 'zh',
  'zh-TW': 'zh',
  'zh-HK': 'zh',
}

function normalizeLocale(locale: string): 'en' | 'ja' | 'zh' {
  const mapped = LOCALE_MAP[locale] ?? locale
  if (['en', 'ja', 'zh'].includes(mapped)) {
    return mapped as 'en' | 'ja' | 'zh'
  }
  return routing.defaultLocale
}

const supportedLocales = routing.locales

export default async function proxy(request: NextRequest) {
  const requestWithAuth = await updateSession(request)

  const acceptLang = requestWithAuth.headers.get('accept-language')
  const preferredLocale = acceptLang?.split(',')?.[0] ?? routing.defaultLocale
  const normalizedLocale = normalizeLocale(preferredLocale)

  // Update the routing object with the normalized locale
  const resolvedRouting = {
    ...routing,
    locales: supportedLocales,
    defaultLocale: routing.defaultLocale,
    getLocale() {
      return supportedLocales.includes(normalizedLocale)
        ? normalizedLocale
        : routing.defaultLocale
    },
  }

  return createMiddleware(resolvedRouting)(request)
}

// Skips all paths that start with /api, /trpc, _next/static, _next/image, _vercel, favicon.ico, or any file with the specified extensions
export const config = {
  matcher: [
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ts|html|ico|woff2?)$).*)',
  ],
}

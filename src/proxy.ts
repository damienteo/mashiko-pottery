import { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { routing } from './i18n/routing'
import { updateSession } from './lib/supabase/middleware'
import { copyCookies } from './lib/supabase/cookies'
import { isSessionRequiredPath } from './lib/i18n/path'

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

function applyIntl(request: NextRequest) {
  const acceptLang = request.headers.get('accept-language')
  const preferredLocale = acceptLang?.split(',')?.[0] ?? routing.defaultLocale
  const normalizedLocale = normalizeLocale(preferredLocale)

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

export default async function proxy(request: NextRequest) {
  // Public catalog pages skip Supabase so HTML can stay static at the edge.
  if (!isSessionRequiredPath(request.nextUrl.pathname)) {
    return applyIntl(request)
  }

  const authResponse = await updateSession(request)
  if (authResponse.headers.get('location')) {
    return authResponse
  }

  const intlResponse = applyIntl(request)
  return copyCookies(authResponse, intlResponse)
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|js|css|ts|html|ico|woff2?)$).*)',
  ],
}

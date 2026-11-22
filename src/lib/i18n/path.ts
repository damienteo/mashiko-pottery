const LOCALE_PREFIX = /^\/(en|ja|zh)(?=\/|$)/

export function stripLocalePrefix(pathname: string): string {
  const stripped = pathname.replace(LOCALE_PREFIX, '')
  return stripped.length > 0 ? stripped : '/'
}

export function localeFromPathname(
  pathname: string
): 'en' | 'ja' | 'zh' | null {
  const match = pathname.match(/^\/(en|ja|zh)(?=\/|$)/)
  if (!match) return null
  return match[1] as 'en' | 'ja' | 'zh'
}

/**
 * HTML routes that must run `updateSession` / `getUser()` so cookies refresh
 * and auth redirects still work. Public catalog pages are not in this list.
 *
 * - admin / seller / profile: require a session; unauthenticated visitors
 *   redirect to login
 * - login / register: session refresh for OTP/magic-link and already-signed-in
 *   visitors; they must not redirect to themselves
 */
export function isSessionRequiredPath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname)
  return /^\/(admin|seller|profile|login|register)(\/|$)/.test(path)
}

/** Unauthenticated visitors are sent to `/{locale}/login`. */
export function isProtectedPath(pathname: string): boolean {
  const path = stripLocalePrefix(pathname)
  return /^\/(admin|seller|profile)(\/|$)/.test(path)
}

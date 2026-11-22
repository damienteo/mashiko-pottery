import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { isProtectedPath, localeFromPathname } from '@/lib/i18n/path'
import { isSafeRelativeCallback } from '@/lib/i18n/callback'
import { routing } from '@/i18n/routing'
import { copyCookies } from '@/lib/supabase/cookies'

export function unauthenticatedLoginUrl(request: NextRequest): URL {
  const url = request.nextUrl.clone()
  const locale =
    localeFromPathname(request.nextUrl.pathname) ?? routing.defaultLocale
  url.pathname = `/${locale}/login`
  url.search = ''
  const callback = `${request.nextUrl.pathname}${request.nextUrl.search}`
  if (isSafeRelativeCallback(callback)) {
    url.searchParams.set('callback', callback)
  }
  return url
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user && isProtectedPath(request.nextUrl.pathname)) {
    const redirectResponse = NextResponse.redirect(
      unauthenticatedLoginUrl(request)
    )
    return copyCookies(supabaseResponse, redirectResponse)
  }
  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!
  return supabaseResponse
}

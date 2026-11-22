'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import {
  useCallback,
  type ComponentProps,
  type FocusEvent,
  type MouseEvent,
  type PointerEvent,
  type TouchEvent,
} from 'react'

const warmed = new Set<string>()

export function hrefToPrefetchUrl(
  href: ComponentProps<typeof NextLink>['href']
): string | null {
  if (typeof href === 'string') return href
  if (href && typeof href === 'object' && typeof href.pathname === 'string') {
    return href.pathname
  }
  return null
}

/** @internal */
export function resetIntentPrefetchCacheForTests(): void {
  warmed.clear()
}

/**
 * App Router link that never viewport-prefetches, but warms the destination
 * route once on hover/focus/touch so `loading.tsx` for that route is available
 * before click.
 */
export default function IntentLink({
  href,
  prefetch = false,
  onMouseEnter,
  onFocus,
  onTouchStart,
  onPointerDown,
  ...props
}: ComponentProps<typeof NextLink>) {
  const router = useRouter()

  const warm = useCallback(() => {
    const url = hrefToPrefetchUrl(href)
    if (!url || warmed.has(url)) return
    warmed.add(url)
    void router.prefetch(url)
  }, [href, router])

  return (
    <NextLink
      href={href}
      prefetch={prefetch}
      onMouseEnter={(event: MouseEvent<HTMLAnchorElement>) => {
        warm()
        onMouseEnter?.(event)
      }}
      onFocus={(event: FocusEvent<HTMLAnchorElement>) => {
        warm()
        onFocus?.(event)
      }}
      onTouchStart={(event: TouchEvent<HTMLAnchorElement>) => {
        warm()
        onTouchStart?.(event)
      }}
      onPointerDown={(event: PointerEvent<HTMLAnchorElement>) => {
        warm()
        onPointerDown?.(event)
      }}
      {...props}
    />
  )
}

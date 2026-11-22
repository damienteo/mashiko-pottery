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
import { useNavigationPending } from '@/components/navigation/NavigationPendingProvider'

const warmed = new Set<string>()

export function hrefToPrefetchUrl(
  href: ComponentProps<typeof NextLink>['href']
): string | null {
  if (typeof href === 'string') return href
  if (href && typeof href === 'object' && typeof href.pathname === 'string') {
    const search =
      typeof href.search === 'string'
        ? href.search
        : href.query
          ? `?${new URLSearchParams(
              href.query as Record<string, string>
            ).toString()}`
          : ''
    return `${href.pathname}${search}`
  }
  return null
}

/** @internal */
export function resetIntentPrefetchCacheForTests(): void {
  warmed.clear()
}

export function shouldInterceptIntentClick(
  event: MouseEvent<HTMLAnchorElement>,
  options: { target?: ComponentProps<typeof NextLink>['target']; href: string }
): boolean {
  if (event.defaultPrevented) return false
  if (event.button !== 0) return false
  if (event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) {
    return false
  }
  if (options.target === '_blank') return false
  if (
    options.href.startsWith('mailto:') ||
    options.href.startsWith('tel:') ||
    options.href.startsWith('javascript:')
  ) {
    return false
  }
  if (/^https?:\/\//i.test(options.href)) {
    try {
      const dest = new URL(options.href)
      if (dest.origin !== window.location.origin) return false
    } catch {
      return false
    }
  }
  return true
}

function isSamePathAndSearch(href: string): boolean {
  const dest = new URL(href, window.location.href)
  return (
    dest.pathname + dest.search ===
    window.location.pathname + window.location.search
  )
}

/**
 * App Router link that never viewport-prefetches. Warms the destination once
 * on hover/focus/touch/pointerdown, and drives in-app navigations through the
 * shared `useTransition` so the layout can dim main content while pending.
 */
export default function IntentLink({
  href,
  prefetch = false,
  onMouseEnter,
  onFocus,
  onTouchStart,
  onPointerDown,
  onClick,
  target,
  ...props
}: ComponentProps<typeof NextLink>) {
  const router = useRouter()
  const { startNavigation } = useNavigationPending()

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
      target={target}
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
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        const url = hrefToPrefetchUrl(href)
        if (!url) return
        if (!shouldInterceptIntentClick(event, { target, href: url })) return
        event.preventDefault()
        if (isSamePathAndSearch(url)) return
        startNavigation(() => {
          router.push(url)
        })
      }}
      {...props}
    />
  )
}

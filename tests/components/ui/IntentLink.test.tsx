/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import IntentLink, {
  hrefToPrefetchUrl,
  resetIntentPrefetchCacheForTests,
} from '@/components/ui/IntentLink'

const prefetch = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch }),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: function MockLink({
    href,
    prefetch: prefetchProp,
    children,
    onMouseEnter,
    onFocus,
    onTouchStart,
    onPointerDown,
  }: {
    href: string
    prefetch?: boolean | null
    children: React.ReactNode
    onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLAnchorElement>) => void
    onTouchStart?: (e: React.TouchEvent<HTMLAnchorElement>) => void
    onPointerDown?: (e: React.PointerEvent<HTMLAnchorElement>) => void
  }) {
    return (
      <a
        href={href}
        data-prefetch={String(prefetchProp)}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onTouchStart={onTouchStart}
        onPointerDown={onPointerDown}
      >
        {children}
      </a>
    )
  },
}))

describe('IntentLink', () => {
  beforeEach(() => {
    prefetch.mockClear()
    resetIntentPrefetchCacheForTests()
  })

  it('keeps viewport prefetch disabled and warms once on hover', () => {
    const { getByText } = render(
      <IntentLink href="/ja/products">Products</IntentLink>
    )
    const link = getByText('Products')
    expect(link).toHaveAttribute('data-prefetch', 'false')

    fireEvent.mouseEnter(link)
    fireEvent.mouseEnter(link)

    expect(prefetch).toHaveBeenCalledTimes(1)
    expect(prefetch).toHaveBeenCalledWith('/ja/products')
  })

  it('prefetches on focus and touch start', () => {
    const { getByText } = render(
      <IntentLink href="/ja/potters">Potters</IntentLink>
    )
    const link = getByText('Potters')
    fireEvent.focus(link)
    expect(prefetch).toHaveBeenCalledWith('/ja/potters')
    prefetch.mockClear()
    resetIntentPrefetchCacheForTests()
    fireEvent.touchStart(link)
    expect(prefetch).toHaveBeenCalledWith('/ja/potters')
    prefetch.mockClear()
    resetIntentPrefetchCacheForTests()
    fireEvent.pointerDown(link)
    expect(prefetch).toHaveBeenCalledWith('/ja/potters')
  })

  it('resolves string hrefs for prefetch', () => {
    expect(hrefToPrefetchUrl('/ja/products')).toBe('/ja/products')
    expect(hrefToPrefetchUrl({ pathname: '/ja/potters' })).toBe('/ja/potters')
  })
})

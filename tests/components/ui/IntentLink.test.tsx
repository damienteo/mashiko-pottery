/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import IntentLink, {
  hrefToPrefetchUrl,
  resetIntentPrefetchCacheForTests,
  shouldInterceptIntentClick,
} from '@/components/ui/IntentLink'

const prefetch = jest.fn()
const push = jest.fn()
const startNavigation = jest.fn((update: () => void | Promise<void>) => {
  void update()
})

jest.mock('next/navigation', () => ({
  useRouter: () => ({ prefetch, push }),
}))

jest.mock('@/components/navigation/NavigationPendingProvider', () => ({
  useNavigationPending: () => ({ isPending: false, startNavigation }),
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
    onClick,
    target,
  }: {
    href: string
    prefetch?: boolean | null
    children: React.ReactNode
    target?: string
    onMouseEnter?: (e: React.MouseEvent<HTMLAnchorElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLAnchorElement>) => void
    onTouchStart?: (e: React.TouchEvent<HTMLAnchorElement>) => void
    onPointerDown?: (e: React.PointerEvent<HTMLAnchorElement>) => void
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
  }) {
    return (
      <a
        href={href}
        target={target}
        data-prefetch={String(prefetchProp)}
        onMouseEnter={onMouseEnter}
        onFocus={onFocus}
        onTouchStart={onTouchStart}
        onPointerDown={onPointerDown}
        onClick={onClick}
      >
        {children}
      </a>
    )
  },
}))

describe('IntentLink', () => {
  beforeEach(() => {
    prefetch.mockClear()
    push.mockClear()
    startNavigation.mockClear()
    resetIntentPrefetchCacheForTests()
    window.history.replaceState({}, '', '/ja/potters')
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

  it('pushes inside startNavigation on a plain left click', () => {
    const { getByText } = render(
      <IntentLink href="/ja/products">Products</IntentLink>
    )
    fireEvent.click(getByText('Products'))
    expect(startNavigation).toHaveBeenCalledTimes(1)
    expect(push).toHaveBeenCalledWith('/ja/products')
  })

  it('does not intercept modified clicks', () => {
    const { getByText } = render(
      <IntentLink href="/ja/products">Products</IntentLink>
    )
    const link = getByText('Products')
    fireEvent.click(link, { metaKey: true })
    fireEvent.click(link, { ctrlKey: true })
    fireEvent.click(link, { shiftKey: true })
    fireEvent.click(link, { altKey: true })
    fireEvent.click(link, { button: 1 })
    expect(startNavigation).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('does not intercept target=_blank', () => {
    const { getByText } = render(
      <IntentLink href="/ja/products" target="_blank">
        Products
      </IntentLink>
    )
    fireEvent.click(getByText('Products'))
    expect(push).not.toHaveBeenCalled()
  })

  it('skips navigation when href is the current path', () => {
    window.history.replaceState({}, '', '/ja/products')
    const { getByText } = render(
      <IntentLink href="/ja/products">Products</IntentLink>
    )
    fireEvent.click(getByText('Products'))
    expect(startNavigation).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('resolves string hrefs for prefetch', () => {
    expect(hrefToPrefetchUrl('/ja/products')).toBe('/ja/products')
    expect(hrefToPrefetchUrl({ pathname: '/ja/potters' })).toBe('/ja/potters')
  })

  it('lets the browser handle modified clicks', () => {
    const event = {
      defaultPrevented: false,
      button: 0,
      metaKey: true,
      altKey: false,
      ctrlKey: false,
      shiftKey: false,
    } as unknown as React.MouseEvent<HTMLAnchorElement>
    expect(shouldInterceptIntentClick(event, { href: '/ja/products' })).toBe(
      false
    )
  })
})

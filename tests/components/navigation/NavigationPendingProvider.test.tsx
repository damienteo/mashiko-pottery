/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { act, render, screen, fireEvent } from '@testing-library/react'
import {
  NavigationPendingMain,
  NavigationPendingProvider,
  useNavigationPending,
} from '@/components/navigation/NavigationPendingProvider'
import { PENDING_UI_DELAY_MS } from '@/components/navigation/pendingUi'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    key === 'loading' ? 'Loading…' : key,
}))

function Trigger() {
  const { startNavigation } = useNavigationPending()
  return (
    <button
      type="button"
      onClick={() => {
        startNavigation(async () => {
          await new Promise<void>(() => {
            /* stay pending */
          })
        })
      }}
    >
      go
    </button>
  )
}

describe('NavigationPendingProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('dims main only after the delay and sets aria-busy while pending', () => {
    render(
      <NavigationPendingProvider>
        <nav>Nav</nav>
        <Trigger />
        <NavigationPendingMain>
          <p>Page body</p>
        </NavigationPendingMain>
        <footer>Foot</footer>
      </NavigationPendingProvider>
    )

    fireEvent.click(screen.getByText('go'))

    const main = screen.getByText('Page body').closest('main')
    expect(main).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByText('Page body').parentElement).not.toHaveClass(
      'opacity-60'
    )
    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(PENDING_UI_DELAY_MS)
    })

    expect(screen.getByText('Page body').parentElement).toHaveClass(
      'opacity-60'
    )
    expect(screen.getByRole('status')).toHaveTextContent('Loading…')
    expect(screen.getByRole('status').nextElementSibling).toHaveClass(
      'sticky',
      'top-[33vh]',
      'justify-center'
    )
    expect(screen.getByText('Nav').closest('main')).toBeNull()
    expect(screen.getByText('Foot').closest('main')).toBeNull()
  })
})

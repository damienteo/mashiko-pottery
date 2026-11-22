'use client'

import { useEffect, useState, type ReactNode } from 'react'

export const PENDING_UI_DELAY_MS = 150

export function useDelayedPending(isPending: boolean): boolean {
  const [showUi, setShowUi] = useState(false)

  useEffect(() => {
    if (!isPending) {
      setShowUi(false)
      return
    }
    const timer = setTimeout(() => setShowUi(true), PENDING_UI_DELAY_MS)
    return () => clearTimeout(timer)
  }, [isPending])

  return showUi
}

export function PendingSurface({
  isPending,
  loadingLabel,
  children,
  className = '',
}: {
  isPending: boolean
  loadingLabel: string
  children: ReactNode
  className?: string
}) {
  const showUi = useDelayedPending(isPending)

  return (
    <div className={`relative ${className}`.trim()}>
      <div
        className={`transition-opacity ${
          showUi ? 'opacity-60 pointer-events-none' : ''
        }`}
      >
        {children}
      </div>
      {showUi ? (
        <div className="absolute inset-0 pointer-events-none">
          <span className="sr-only" role="status">
            {loadingLabel}
          </span>
          <div className="sticky top-[33vh] flex justify-center -translate-y-1/2">
            <div
              className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin motion-reduce:animate-none"
              aria-hidden
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

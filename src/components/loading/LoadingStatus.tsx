import type { ReactNode } from 'react'

type LoadingStatusProps = {
  loadingText: string
  skeleton: string
  children: ReactNode
}

export default function LoadingStatus({
  loadingText,
  skeleton,
  children,
}: LoadingStatusProps) {
  return (
    <div aria-busy="true" data-testid="route-skeleton" data-skeleton={skeleton}>
      <span className="sr-only">{loadingText}</span>
      {children}
    </div>
  )
}

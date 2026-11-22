import type { ReactNode } from 'react'

type LoadingStatusProps = {
  loadingText: string
  children: ReactNode
}

export default function LoadingStatus({
  loadingText,
  children,
}: LoadingStatusProps) {
  return (
    <div aria-busy="true">
      <span className="sr-only">{loadingText}</span>
      {children}
    </div>
  )
}

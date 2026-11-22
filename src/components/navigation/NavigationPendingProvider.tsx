'use client'

import {
  createContext,
  useCallback,
  useContext,
  useTransition,
  type ReactNode,
} from 'react'
import { useTranslations } from 'next-intl'
import { PendingSurface } from '@/components/navigation/pendingUi'

type NavigationPendingContextValue = {
  isPending: boolean
  startNavigation: (update: () => void | Promise<void>) => void
}

const NavigationPendingContext = createContext<NavigationPendingContextValue>({
  isPending: false,
  startNavigation: (update) => {
    void update()
  },
})

export function NavigationPendingProvider({
  children,
}: {
  children: ReactNode
}) {
  const [isPending, startTransition] = useTransition()

  const startNavigation = useCallback((update: () => void | Promise<void>) => {
    startTransition(update)
  }, [])

  return (
    <NavigationPendingContext.Provider value={{ isPending, startNavigation }}>
      {children}
    </NavigationPendingContext.Provider>
  )
}

export function useNavigationPending(): NavigationPendingContextValue {
  return useContext(NavigationPendingContext)
}

export function NavigationPendingMain({ children }: { children: ReactNode }) {
  const { isPending } = useNavigationPending()
  const t = useTranslations('common')

  return (
    <main className="flex-grow" aria-busy={isPending || undefined}>
      <PendingSurface isPending={isPending} loadingLabel={t('loading')}>
        {children}
      </PendingSurface>
    </main>
  )
}

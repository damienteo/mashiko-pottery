'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ClientAnalytics() {
  const path = usePathname()
  const params = useSearchParams()

  useEffect(() => {
    const pagePath = path + (params.toString() ? `?${params}` : '')
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
        page_path: pagePath,
      })
    }
  }, [path, params])

  return <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID!} />
}

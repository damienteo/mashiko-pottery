'use client'

import { GoogleAnalytics } from '@next/third-parties/google'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

const gaId = process.env.NEXT_PUBLIC_GA_ID

export default function ClientAnalytics() {
  const path = usePathname()
  const params = useSearchParams()

  useEffect(() => {
    if (!gaId) return
    const pagePath = path + (params.toString() ? `?${params}` : '')
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', gaId, {
        page_path: pagePath,
      })
    }
  }, [path, params])

  if (!gaId) return null

  return <GoogleAnalytics gaId={gaId} />
}

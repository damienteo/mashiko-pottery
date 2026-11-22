'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useLocale } from 'next-intl'
import { routing } from '@/i18n/routing'

export default function LanguageSelector() {
  const router = useRouter()
  const path = usePathname() || ''
  const searchParams = useSearchParams()
  const locale = useLocale()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    // Build a new URL preserving the "rest" of the path beyond the locale
    // e.g. path "/zh/products/5" -> segments ["", "zh", "products", "5"]
    const parts = path.split('/')
    // drop the first '' and the existing locale at index 1
    const rest = parts.slice(2).join('/')
    const restPath = rest ? `/${rest}` : ''
    let target = `/${newLocale}${restPath}`
    const params = searchParams.toString()
    if (params) {
      target += `?${params}`
    }
    router.push(target)
  }

  return (
    <select
      value={locale}
      onChange={handleChange}
      className="ml-4 border rounded p-1 bg-white"
      aria-label="Select language"
    >
      {routing.locales.map((loc) => (
        <option key={loc} value={loc}>
          {loc.toUpperCase()}
        </option>
      ))}
    </select>
  )
}

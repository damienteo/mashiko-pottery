'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ProductsToolbar from '@/components/products/ProductsToolbar'
import ProductGrid from '@/components/products/ProductGrid'
import { fetchProductListFromApi } from '@/lib/catalog/fetchProductList'
import {
  emptyProductFilters,
  parseProductListSearchParams,
  toProductListQueryString,
} from '@/lib/catalog/productListQuery'
import type { ProductListResult } from '@/lib/catalog/products'
import type { ProductFilters } from '@/types/common'
import type { Locale } from '@/types/i18n'

export default function ProductsCatalog({
  initialData,
  locale,
  serverGrid,
}: {
  initialData: ProductListResult
  locale: Locale
  serverGrid: React.ReactNode
}) {
  const t = useTranslations()
  const router = useRouter()
  const pathname = usePathname()
  const [data, setData] = useState<ProductListResult>(initialData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (page: number, limit: number, filters: Partial<ProductFilters>) => {
      setIsLoading(true)
      setError(null)
      try {
        const next = await fetchProductListFromApi({ page, limit, filters })
        setData(next)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products'
        )
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  // Read the query on the client after paint so this island can SSR the
  // same title/toolbar/grid markup. useSearchParams + Suspense fallback={null}
  // left the section empty until hydration and pushed the footer (CLS 0.16).
  useEffect(() => {
    const parsed = parseProductListSearchParams(
      new URLSearchParams(window.location.search),
      locale,
      {
        page: initialData.pagination.page,
        limit: initialData.pagination.limit,
      }
    )
    if (!parsed.hasQuery) {
      return
    }
    void load(parsed.page, parsed.limit, { ...parsed.filters, locale })
  }, [locale, load, initialData.pagination.page, initialData.pagination.limit])

  const pushQuery = (
    page: number,
    limit: number,
    filters: Partial<ProductFilters>
  ) => {
    const qs = toProductListQueryString({
      page,
      limit,
      filters: { ...filters, locale },
    })
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    void load(page, limit, { ...filters, locale })
  }

  const filters: ProductFilters = {
    ...emptyProductFilters(),
    ...data.filters,
    locale,
  }
  const pagination = data.pagination
  const showServerGrid = data === initialData && !isLoading

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t('products.title')}
        </h1>

        <ProductsToolbar
          value={filters}
          onSearch={(next) => {
            pushQuery(1, pagination.limit, next)
          }}
          categories={['vase', 'cup', 'plate', 'bottle', 'bowl']}
          styles={['yakishime', 'shino', 'oribe']}
          showPotterId={false}
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onChangeLimit={(size) => {
            pushQuery(1, size, filters)
          }}
          onChangePage={(pageNum) => {
            pushQuery(pageNum, pagination.limit, filters)
          }}
        />

        <div className="mt-8">
          {isLoading && data.products.length === 0 ? (
            <p className="text-center text-gray-500">{t('common.loading')}</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : data.products.length === 0 ? (
            <p className="text-center text-gray-500">{t('products.empty')}</p>
          ) : showServerGrid ? (
            serverGrid
          ) : (
            <ProductGrid products={data.products} locale={locale} />
          )}
        </div>
      </div>
    </section>
  )
}

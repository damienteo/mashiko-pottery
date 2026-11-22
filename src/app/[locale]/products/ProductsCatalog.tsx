'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
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

function ProductsCatalogInner({
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
  const searchParams = useSearchParams()
  const parsed = useMemo(
    () =>
      parseProductListSearchParams(searchParams, locale, {
        page: initialData.pagination.page,
        limit: initialData.pagination.limit,
      }),
    [
      searchParams,
      locale,
      initialData.pagination.page,
      initialData.pagination.limit,
    ]
  )

  const [data, setData] = useState<ProductListResult | null>(
    parsed.hasQuery ? null : initialData
  )
  const [isLoading, setIsLoading] = useState(parsed.hasQuery)
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

  useEffect(() => {
    if (!parsed.hasQuery) {
      setData(initialData)
      setIsLoading(false)
      return
    }
    void load(parsed.page, parsed.limit, { ...parsed.filters, locale })
    // URL is the source of truth; run when the query string changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()])

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
  }

  const shown = data ?? initialData
  const filters: ProductFilters = {
    ...emptyProductFilters(),
    ...shown.filters,
    locale,
  }
  const pagination = shown.pagination
  const showServerGrid = !parsed.hasQuery && data === initialData && !isLoading

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
          {isLoading && (!data || data.products.length === 0) ? (
            <p className="text-center text-gray-500">{t('common.loading')}</p>
          ) : error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : shown.products.length === 0 ? (
            <p className="text-center text-gray-500">{t('products.empty')}</p>
          ) : showServerGrid ? (
            serverGrid
          ) : (
            <ProductGrid products={shown.products} locale={locale} />
          )}
        </div>
      </div>
    </section>
  )
}

export default function ProductsCatalog({
  initialData,
  locale,
  serverGrid,
}: {
  initialData: ProductListResult
  locale: Locale
  serverGrid: React.ReactNode
}) {
  return (
    <Suspense fallback={null}>
      <ProductsCatalogInner
        initialData={initialData}
        locale={locale}
        serverGrid={serverGrid}
      />
    </Suspense>
  )
}

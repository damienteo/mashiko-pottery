'use client'

import { useCallback, useEffect, useState, useTransition } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import ProductsToolbar from '@/components/products/ProductsToolbar'
import ProductGrid from '@/components/products/ProductGrid'
import { PendingSurface } from '@/components/navigation/pendingUi'
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
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<ProductListResult>(initialData)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(
    async (page: number, limit: number, filters: Partial<ProductFilters>) => {
      const next = await fetchProductListFromApi({ page, limit, filters })
      setData(next)
    },
    []
  )

  const syncFromLocation = useCallback(() => {
    const parsed = parseProductListSearchParams(
      new URLSearchParams(window.location.search),
      locale,
      {
        page: initialData.pagination.page,
        limit: initialData.pagination.limit,
      }
    )
    if (!parsed.hasQuery) {
      startTransition(() => {
        setData(initialData)
        setError(null)
      })
      return
    }
    startTransition(async () => {
      setError(null)
      try {
        await load(parsed.page, parsed.limit, { ...parsed.filters, locale })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products'
        )
      }
    })
  }, [initialData, locale, load])

  // SSR the catalog markup; sync query after paint and on Back/Forward (popstate).
  useEffect(() => {
    syncFromLocation()
    const onPopState = () => {
      syncFromLocation()
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [syncFromLocation])

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
    startTransition(async () => {
      setError(null)
      try {
        router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
        await load(page, limit, { ...filters, locale })
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to fetch products'
        )
      }
    })
  }

  const filters: ProductFilters = {
    ...emptyProductFilters(),
    ...data.filters,
    locale,
  }
  const pagination = data.pagination
  const showServerGrid = data === initialData

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
          {error ? (
            <p className="text-center text-red-600">{error}</p>
          ) : (
            <PendingSurface
              isPending={isPending}
              loadingLabel={t('common.loading')}
            >
              {data.products.length === 0 ? (
                <p className="text-center text-gray-500">
                  {t('products.empty')}
                </p>
              ) : showServerGrid ? (
                serverGrid
              ) : (
                <ProductGrid products={data.products} locale={locale} />
              )}
            </PendingSurface>
          )}
        </div>
      </div>
    </section>
  )
}

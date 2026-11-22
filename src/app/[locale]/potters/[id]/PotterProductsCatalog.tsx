'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import ProductsToolbar from '@/components/products/ProductsToolbar'
import ProductGrid from '@/components/products/ProductGrid'
import { fetchProductListFromApi } from '@/lib/catalog/fetchProductList'
import { emptyProductFilters } from '@/lib/catalog/productListQuery'
import type { ProductListResult } from '@/lib/catalog/products'
import type { ProductFilters } from '@/types/common'
import type { Locale } from '@/types/i18n'

export default function PotterProductsCatalog({
  potterId,
  locale,
  initialData,
  serverGrid,
}: {
  potterId: number
  locale: Locale
  initialData: ProductListResult
  serverGrid: React.ReactNode
}) {
  const tProduct = useTranslations('product')
  const [data, setData] = useState<ProductListResult>(initialData)
  const [filtersLocal, setFiltersLocal] = useState<ProductFilters>({
    ...emptyProductFilters(),
    locale,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingServerGrid, setUsingServerGrid] = useState(true)

  const pagination = data.pagination

  const load = async (
    page: number,
    limit: number,
    nextFilters: ProductFilters
  ) => {
    setIsLoading(true)
    setError(null)
    setUsingServerGrid(false)
    try {
      const result = await fetchProductListFromApi({
        page,
        limit,
        filters: { ...nextFilters, potterId, locale },
      })
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">
        {tProduct('moreFromThisPotter')}
      </h2>

      <ProductsToolbar
        value={filtersLocal}
        onSearch={(next) => {
          setFiltersLocal(next)
          void load(1, pagination.limit || 20, next)
        }}
        categories={['vase', 'cup', 'plate', 'bottle', 'bowl']}
        styles={['yakishime', 'shino', 'oribe']}
        showPotterId={false}
        page={pagination.page || 1}
        totalPages={pagination.totalPages || 0}
        limit={pagination.limit || 20}
        onChangeLimit={(size) => {
          void load(1, size, filtersLocal)
        }}
        onChangePage={(pageNum) => {
          void load(pageNum, pagination.limit || 20, filtersLocal)
        }}
      />

      {error && (
        <div className="p-8 text-red-600">
          <p>{error}</p>
          <button
            type="button"
            className="mt-2 rounded bg-gray-800 text-white px-3 py-1"
            onClick={() => void load(1, pagination.limit || 20, filtersLocal)}
          >
            Retry
          </button>
        </div>
      )}

      {isLoading && !error && <p className="p-8">{tProduct('loading')}</p>}

      {!isLoading && !error && data.products.length === 0 && (
        <p className="p-8">{tProduct('list.empty')}</p>
      )}

      {!isLoading && !error && data.products.length > 0 && (
        <div className="mt-6">
          {usingServerGrid ? (
            serverGrid
          ) : (
            <ProductGrid
              products={data.products}
              locale={locale}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            />
          )}
        </div>
      )}
    </section>
  )
}

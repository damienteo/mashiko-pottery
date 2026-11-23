'use client'

import { useState, useTransition } from 'react'
import { useTranslations } from 'next-intl'
import ProductsToolbar from '@/components/products/ProductsToolbar'
import ProductGrid from '@/components/products/ProductGrid'
import { PendingSurface } from '@/components/navigation/pendingUi'
import { fetchProductListFromApi } from '@/lib/catalog/fetchProductList'
import { emptyProductFilters } from '@/lib/catalog/productListQuery'
import type { ProductListResult } from '@/lib/catalog/products'
import type { ProductFilters } from '@/types/common'
import type { Locale } from '@/types/i18n'

export default function PotterProductsCatalog({
  potterId,
  potterName,
  locale,
  initialData,
  serverGrid,
}: {
  potterId: number
  potterName?: string
  locale: Locale
  initialData: ProductListResult
  serverGrid: React.ReactNode
}) {
  const tProduct = useTranslations('product')
  const tCommon = useTranslations('common')
  const tProducts = useTranslations('products')
  const [isPending, startTransition] = useTransition()
  const [data, setData] = useState<ProductListResult>(initialData)
  const [filtersLocal, setFiltersLocal] = useState<ProductFilters>({
    ...emptyProductFilters(),
    locale,
  })
  const [error, setError] = useState<string | null>(null)
  const [usingServerGrid, setUsingServerGrid] = useState(true)

  const pagination = data.pagination
  const name = potterName?.trim() ?? ''
  const worksHeading = name ? tProduct('worksBy', { name }) : tProduct('works')

  const load = async (
    page: number,
    limit: number,
    nextFilters: ProductFilters
  ) => {
    const result = await fetchProductListFromApi({
      page,
      limit,
      filters: { ...nextFilters, potterId, locale },
    })
    setUsingServerGrid(false)
    setData(result)
  }

  const runLoad = (
    page: number,
    limit: number,
    nextFilters: ProductFilters
  ) => {
    startTransition(async () => {
      setError(null)
      try {
        await load(page, limit, nextFilters)
      } catch {
        setError(tProducts('fetchError'))
      }
    })
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-semibold mb-6">{worksHeading}</h2>

      <ProductsToolbar
        value={filtersLocal}
        onSearch={(next) => {
          setFiltersLocal(next)
          runLoad(1, pagination.limit || 20, next)
        }}
        categories={['vase', 'cup', 'plate', 'bottle', 'bowl']}
        showPotterId={false}
        showStyle={false}
        showActive={false}
        page={pagination.page || 1}
        totalPages={pagination.totalPages || 0}
        limit={pagination.limit || 20}
        onChangeLimit={(size) => {
          runLoad(1, size, filtersLocal)
        }}
        onChangePage={(pageNum) => {
          runLoad(pageNum, pagination.limit || 20, filtersLocal)
        }}
      />

      {error ? (
        <div className="p-8 text-red-600">
          <p>{error}</p>
          <button
            type="button"
            className="mt-2 rounded bg-gray-800 text-white px-3 py-1"
            onClick={() => runLoad(1, pagination.limit || 20, filtersLocal)}
          >
            {tProduct('list.retry')}
          </button>
        </div>
      ) : (
        <PendingSurface
          isPending={isPending}
          loadingLabel={tCommon('loading')}
          className="mt-6"
        >
          {data.products.length === 0 ? (
            <p className="p-8">{tProduct('list.empty')}</p>
          ) : usingServerGrid ? (
            serverGrid
          ) : (
            <ProductGrid
              products={data.products}
              locale={locale}
              variant="compact"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            />
          )}
        </PendingSurface>
      )}
    </section>
  )
}

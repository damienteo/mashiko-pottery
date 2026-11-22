'use client'

import { Suspense } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

import ProductCard from '@/components/products/ProductCard'
import ProductsToolbar from '@/components/products/ProductsToolbar'
import ProductsQuerySync from './ProductsQuerySync'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListIsSuccess,
  selectProductsListError,
  selectProductsListFilters,
  selectProductsListPagination,
  setProductsFilters,
  setProductsPage,
  setProductsLimit,
} from '@/store/products/productsListSlice'
import { fetchProductsList } from '@/store/thunks/fetchProductsList'

import type { ProductFilters } from '@/types/common'
import type { Locale } from '@/types/i18n'
import type { ProductListResult } from '@/lib/catalog/products'

type PushQueryParams = Partial<ProductFilters> & {
  page?: number
  limit?: number
  locale?: Locale | null
}

export default function ProductsClient({
  initialData,
}: {
  initialData: ProductListResult
}) {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const dispatch = useAppDispatch()

  const router = useRouter()
  const pathname = usePathname()

  const storeProducts = useAppSelector(selectAllProducts)
  const isLoading = useAppSelector(selectProductsListIsLoading)
  const isSuccess = useAppSelector(selectProductsListIsSuccess)
  const error = useAppSelector(selectProductsListError)
  const storeFilters = useAppSelector(selectProductsListFilters)
  const storePagination = useAppSelector(selectProductsListPagination)

  const useStore = isSuccess || isLoading
  const products = useStore ? storeProducts : initialData.products
  const filters = useStore ? storeFilters : initialData.filters
  const pagination = useStore ? storePagination : initialData.pagination

  const pushQuery = (q: PushQueryParams) => {
    const params = new URLSearchParams()
    const set = (k: string, v: unknown) => {
      if (v === null || v === undefined || v === '') return
      params.set(k, String(v))
    }

    set('page', q.page)
    set('limit', q.limit)
    set('category', q.category ?? null)
    set('style', q.style ?? null)
    set('priceMin', q.priceMin ?? null)
    set('priceMax', q.priceMax ?? null)
    set('active', typeof q.active === 'boolean' ? q.active : undefined)
    set('potterId', q.potterId ?? null)
    set('q', q.q ?? null)
    set('locale', q.locale ?? null)

    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t('products.title')}
        </h1>

        <Suspense fallback={null}>
          <ProductsQuerySync initialData={initialData} locale={locale} />
        </Suspense>

        <ProductsToolbar
          value={filters}
          onSearch={(next: Partial<ProductFilters>) => {
            dispatch(setProductsFilters(next))
            dispatch(setProductsPage(1))
            void dispatch(
              fetchProductsList({
                page: 1,
                limit: pagination.limit,
                filters: { ...next, locale },
              })
            )
            pushQuery({
              page: 1,
              limit: pagination.limit,
              ...next,
              locale,
            })
          }}
          categories={['vase', 'cup', 'plate', 'bottle', 'bowl']}
          styles={['yakishime', 'shino', 'oribe']}
          showPotterId={false}
          page={pagination.page}
          totalPages={pagination.totalPages}
          limit={pagination.limit}
          onChangeLimit={(size) => {
            dispatch(setProductsLimit(size))
            dispatch(setProductsPage(1))
            void dispatch(
              fetchProductsList({
                page: 1,
                limit: size,
                filters: { ...(filters ?? {}), locale },
              })
            )
            pushQuery({
              page: 1,
              limit: size,
              ...(filters ?? {}),
              locale,
            })
          }}
          onChangePage={(pageNum) => {
            dispatch(setProductsPage(pageNum))
            void dispatch(
              fetchProductsList({
                page: pageNum,
                limit: pagination.limit,
                filters: { ...(filters ?? {}), locale },
              })
            )
            pushQuery({
              page: pageNum,
              limit: pagination.limit,
              ...(filters ?? {}),
              locale,
            })
          }}
        />

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading && products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              {t('common.loading')}
            </p>
          ) : error ? (
            <p className="col-span-full text-center text-red-600">{error}</p>
          ) : products.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              {t('products.empty')}
            </p>
          ) : (
            products.map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))
          )}
        </div>
      </div>
    </section>
  )
}

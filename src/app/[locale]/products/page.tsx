'use client'

import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

import ProductCard from '@/components/products/ProductCard'
import ProductsToolbar from '@/components/products/ProductsToolbar'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectAllProducts,
  selectProductsListIsLoading,
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

type PushQueryParams = Partial<ProductFilters> & {
  page?: number
  limit?: number
  locale?: Locale | null
}

export default function ProductsPage() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const dispatch = useAppDispatch()

  const router = useRouter()
  const pathname = usePathname()

  const searchParams = useSearchParams()

  const products = useAppSelector(selectAllProducts)
  const isLoading = useAppSelector(selectProductsListIsLoading)
  const error = useAppSelector(selectProductsListError)
  const filters = useAppSelector(selectProductsListFilters)
  const pagination = useAppSelector(selectProductsListPagination)

  const hasFetched = useRef(false)

  // Helper: push current state to URL (client-side, no full refresh)
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

  // Initial hydration from URL + fetch (subsequent searches driven by toolbar handlers)
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    // helpers to coerce query params
    const num = (v: string | null) => (v == null ? undefined : Number(v))
    const bool = (v: string | null) =>
      v == null ? undefined : v === 'true' || v === '1'

    // Parse URL parameters
    const pageParam = num(searchParams.get('page'))
    const limitParam = num(searchParams.get('limit'))
    const category = searchParams.get('category') || null
    const style = searchParams.get('style') || null
    const priceMinParam = num(searchParams.get('priceMin'))
    const priceMaxParam = num(searchParams.get('priceMax'))
    const activeParam = bool(searchParams.get('active'))
    const potterIdParam = num(searchParams.get('potterId'))
    const q = searchParams.get('q') || null

    // Prefer locale from URL if present; otherwise use current locale
    const urlLocale = (searchParams.get('locale') as Locale | null) ?? locale

    const page = pageParam && pageParam > 0 ? pageParam : (pagination.page ?? 1)
    const limit =
      limitParam && limitParam > 0 ? limitParam : (pagination.limit ?? 50)

    const initialFilters: Partial<ProductFilters> = {
      category: category ?? null,
      style: style ?? null,
      priceMin:
        typeof priceMinParam === 'number' && !Number.isNaN(priceMinParam)
          ? priceMinParam
          : null,
      priceMax:
        typeof priceMaxParam === 'number' && !Number.isNaN(priceMaxParam)
          ? priceMaxParam
          : null,
      active: typeof activeParam === 'boolean' ? activeParam : null,
      potterId:
        typeof potterIdParam === 'number' && !Number.isNaN(potterIdParam)
          ? potterIdParam
          : null,
      q,
      locale: urlLocale,
    }

    // Optimistically hydrate Redux with URL/page/limit/filters so the toolbar reflects state immediately
    dispatch(setProductsPage(page))
    dispatch(setProductsLimit(limit))
    dispatch(setProductsFilters(initialFilters))

    dispatch(
      fetchProductsList({
        page,
        limit,
        filters: initialFilters,
      })
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          {t('products.title')}
        </h1>

        <ProductsToolbar
          value={filters}
          onSearch={(next: Partial<ProductFilters>) => {
            // Optimistically update store
            dispatch(setProductsFilters(next))
            dispatch(setProductsPage(1))
            // Fire the search
            dispatch(
              fetchProductsList({
                page: 1,
                limit: pagination.limit,
                filters: { ...next, locale },
              })
            )
            // Sync to URL
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
            // Update store first
            dispatch(setProductsLimit(size))
            dispatch(setProductsPage(1))
            // Fetch
            dispatch(
              fetchProductsList({
                page: 1,
                limit: size,
                filters: { ...(filters ?? {}), locale },
              })
            )
            // Update URL
            pushQuery({
              page: 1,
              limit: size,
              ...(filters ?? {}),
              locale,
            })
          }}
          onChangePage={(pageNum) => {
            // Update store first
            dispatch(setProductsPage(pageNum))
            // Fetch
            dispatch(
              fetchProductsList({
                page: pageNum,
                limit: pagination.limit,
                filters: { ...(filters ?? {}), locale },
              })
            )
            // Sync URL
            pushQuery({
              page: pageNum,
              limit: pagination.limit,
              ...(filters ?? {}),
              locale,
            })
          }}
        />

        {/* Grid content – keep toolbar visible, only swap body */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {isLoading ? (
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

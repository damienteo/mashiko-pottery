'use client'

import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'

import Gallery from '@/components/ui/Gallery'
import ProductCard from '@/components/products/ProductCard'
import ProductsToolbar from '@/components/products/ProductsToolbar' // <-- NEW
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchPotterDetails,
  selectPotterDetails,
  selectPotterDetailsIsLoading,
  selectPotterDetailsIsSuccess,
  selectPotterDetailsError,
} from '@/store/potters/potterDetailsSlice'
import {
  selectAllProducts,
  selectProductsListIsLoading,
  selectProductsListIsSuccess,
  selectProductsListError,
  selectProductsListPagination,
} from '@/store/products/productsListSlice'
import { fetchProductsList } from '@/store/thunks/fetchProductsList'
import type { Locale } from '@/types/i18n'
import type { ProductFilters } from '@/types/common' // <-- NEW (for toolbar value typing)

export default function PotterClient() {
  const t = useTranslations('potter')
  const tProduct = useTranslations('product')
  const locale = useLocale() as Locale
  const { id } = useParams() as { id: string }
  const dispatch = useAppDispatch()

  const potter = useAppSelector(selectPotterDetails)
  const isLoading = useAppSelector(selectPotterDetailsIsLoading)
  const isSuccess = useAppSelector(selectPotterDetailsIsSuccess)
  const error = useAppSelector(selectPotterDetailsError)

  const allProducts = useAppSelector(selectAllProducts)
  const productsLoading = useAppSelector(selectProductsListIsLoading)
  const productsSuccess = useAppSelector(selectProductsListIsSuccess)
  const productsError = useAppSelector(selectProductsListError)
  const pagination = useAppSelector(selectProductsListPagination)

  // Local toolbar state (no potterId shown; it is always forced in the query)
  const defaultFilters = useMemo<ProductFilters>(
    () => ({
      name: null,
      category: null,
      style: null,
      active: null,
      priceMin: null,
      priceMax: null,
      potterId: null, // will be injected on search
      locale: null, // will be injected on search
    }),
    []
  )
  const [filtersLocal, setFiltersLocal] =
    useState<ProductFilters>(defaultFilters)

  // Fetch potter details (one-time per id)
  useEffect(() => {
    if (id && (!potter || String(potter.id) !== id)) {
      dispatch(fetchPotterDetails(id))
    }
  }, [dispatch, id, potter])

  // Fetch this potter's products on first ready
  useEffect(() => {
    if (potter && !productsLoading && !productsSuccess && !productsError) {
      dispatch(fetchProductsList({ filters: { potterId: Number(id), locale } }))
    }
  }, [
    dispatch,
    potter,
    id,
    locale,
    productsLoading,
    productsSuccess,
    productsError,
  ])

  if (isLoading) return <p className="p-8">{t('loading')}</p>
  if (!isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>
  if (!potter) return <p className="p-8">{t('loading')}</p>

  return (
    <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="w-full lg:h-full">
          <Gallery
            images={(potter.imageUrl ? [potter.imageUrl] : [])
              .concat(
                Array.isArray(potter.photos)
                  ? potter.photos.filter(Boolean)
                  : []
              )
              .filter(Boolean)
              .filter((v, i, a) => a.indexOf(v) === i)
              .concat(
                !potter.imageUrl &&
                  (!potter.photos || potter.photos.length === 0)
                  ? ['/images/potter-fallback.webp']
                  : []
              )}
            title={potter.name[locale as keyof typeof potter.name] || 'Potter'}
            imagePriority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl font-semibold mb-4">
            {potter.name[locale as keyof typeof potter.name]}
          </h1>
          <p className="text-gray-700 text-lg">
            {potter.bio[locale as keyof typeof potter.bio]}
          </p>
          <dl className="mt-4 text-gray-600">
            {potter.style && (
              <>
                <dt className="font-medium">{t('style')}</dt>
                <dd className="mb-2">{potter.style}</dd>
              </>
            )}
            <dt className="font-medium">{t('active')}</dt>
            <dd className="mb-2">{potter.active ? t('yes') : t('no')}</dd>
          </dl>
        </div>
      </div>

      {/* Products from this potter – toolbar + grid */}
      <section className="mt-12">
        <h2 className="text-2xl font-semibold mb-6">
          {tProduct('moreFromThisPotter')}
        </h2>

        {/* Toolbar: potterId hidden, every search is forced to this potter */}
        <ProductsToolbar
          value={filtersLocal}
          onSearch={(next) => {
            setFiltersLocal(next)
            dispatch(
              fetchProductsList({
                page: 1,
                limit: pagination?.limit || 20, // default page size for this page
                filters: {
                  ...next,
                  potterId: Number(id), // lock to current potter
                  locale,
                },
              })
            )
          }}
          categories={['vase', 'cup', 'plate', 'bottle', 'bowl']}
          styles={['yakishime', 'shino', 'oribe']}
          showPotterId={false}
          page={pagination?.page || 1}
          totalPages={pagination?.totalPages || 0}
          limit={pagination?.limit || 20}
          onChangeLimit={(size) => {
            dispatch(
              fetchProductsList({
                page: 1,
                limit: size,
                filters: { ...filtersLocal, potterId: Number(id), locale },
              })
            )
          }}
          onChangePage={(pageNum) => {
            dispatch(
              fetchProductsList({
                page: pageNum,
                limit: pagination?.limit || 20,
                filters: { ...filtersLocal, potterId: Number(id), locale },
              })
            )
          }}
        />

        {productsError && (
          <div className="p-8 text-red-600">
            <p>{String(productsError)}</p>
            <button
              type="button"
              className="mt-2 rounded bg-gray-800 text-white px-3 py-1"
              onClick={() =>
                dispatch(
                  fetchProductsList({
                    filters: { ...filtersLocal, potterId: Number(id), locale },
                  })
                )
              }
            >
              Retry
            </button>
          </div>
        )}

        {productsLoading && !productsError && (
          <p className="p-8">{tProduct('loading')}</p>
        )}

        {!productsLoading && !productsError && allProducts.length === 0 && (
          <p className="p-8">{tProduct('list.empty')}</p>
        )}

        {!productsLoading && !productsError && allProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} locale={locale} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

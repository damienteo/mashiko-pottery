'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslations, useLocale } from 'next-intl'

import ProductDetails from '@/components/products/ProductDetails'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchProductDetails,
  hydrateProductDetails,
  selectProductDetails,
  selectProductDetailsIsLoading,
  selectProductDetailsIsSuccess,
  selectProductDetailsError,
} from '@/store/products/productDetailsSlice'
import { logViewItem } from '@/lib/analytics'
import type { Locale } from '@/types/i18n'
import {
  fetchPotterDetails,
  hydratePotterDetails,
  selectPotterDetails,
  selectPotterDetailsIsLoading,
  selectPotterDetailsIsSuccess,
  selectPotterDetailsError,
} from '@/store/potters/potterDetailsSlice'
import { fetchProductsList } from '@/store/thunks/fetchProductsList'
import {
  selectAllProducts,
  selectProductsListError,
  selectProductsListFilters,
  selectProductsListIsLoading,
  selectProductsListIsSuccess,
  selectProductsListPagination,
} from '@/store/products/productsListSlice'
import type { Product } from '@/types/product'
import type { Potter } from '@/types/potter'
import type { ProductListResult } from '@/lib/catalog/products'
import { pickById, pickScopedProductList } from '@/lib/catalog/pickCached'

export default function ProductClient({
  initialProduct = null,
  initialPotter = null,
  initialProductList = null,
}: {
  initialProduct?: Product | null
  initialPotter?: Potter | null
  initialProductList?: ProductListResult | null
}) {
  const t = useTranslations('product')
  const locale = useLocale() as Locale
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const storeProduct = useAppSelector(selectProductDetails)
  const isLoading = useAppSelector(selectProductDetailsIsLoading)
  const isSuccess = useAppSelector(selectProductDetailsIsSuccess)
  const error = useAppSelector(selectProductDetailsError)

  const storePotter = useAppSelector(selectPotterDetails)
  const potterIsLoading = useAppSelector(selectPotterDetailsIsLoading)
  const potterIsSuccess = useAppSelector(selectPotterDetailsIsSuccess)
  const potterError = useAppSelector(selectPotterDetailsError)

  const storeProducts = useAppSelector(selectAllProducts)
  const listIsLoading = useAppSelector(selectProductsListIsLoading)
  const listIsSuccess = useAppSelector(selectProductsListIsSuccess)
  const listError = useAppSelector(selectProductsListError)
  const storeFilters = useAppSelector(selectProductsListFilters)
  const storePagination = useAppSelector(selectProductsListPagination)

  const numericId = Number(id)
  const product = pickById(storeProduct, initialProduct, numericId)
  const potter = pickById(
    storePotter,
    initialPotter,
    product?.potterId ?? initialPotter?.id ?? null
  )
  const relatedList = pickScopedProductList({
    store: {
      products: storeProducts,
      filters: storeFilters,
      pagination: storePagination,
    },
    initial: initialProductList,
    expectedPotterId: product?.potterId ?? null,
    storeReady: listIsSuccess || listIsLoading,
  })
  const allProducts = relatedList?.products ?? []

  useEffect(() => {
    if (initialProduct && initialProduct.id === numericId) {
      dispatch(hydrateProductDetails(initialProduct))
    }
    if (
      initialPotter &&
      (product == null || initialPotter.id === product.potterId)
    ) {
      dispatch(hydratePotterDetails(initialPotter))
    }
    // Related products stay in initialProductList so they do not overwrite
    // the catalog productsList singleton used by /products.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  useEffect(() => {
    if (!id) return
    if (product?.id === numericId) return
    if (!isLoading && (!isSuccess || product?.id !== numericId)) {
      dispatch(fetchProductDetails(id))
    }
  }, [dispatch, id, product?.id, isLoading, isSuccess, numericId, product])

  useEffect(() => {
    if (product) {
      logViewItem({
        id: product.id,
        title: product.title[locale],
        price: product.price,
      })
    }
  }, [product, locale])

  useEffect(() => {
    if (
      isSuccess &&
      product?.potterId &&
      !potterIsLoading &&
      !potterIsSuccess &&
      !potterError // prevent continuous retries after a failure
    ) {
      void dispatch(fetchPotterDetails(String(product.potterId)))
    }
  }, [
    dispatch,
    isSuccess,
    product?.potterId,
    potterIsLoading,
    potterIsSuccess,
    potterError, // watch error so it can block retries
  ])

  useEffect(() => {
    if (initialProductList) return
    if (
      isSuccess &&
      product?.potterId &&
      !listIsLoading &&
      !listIsSuccess &&
      !listError // prevent continuous retries after a failure
    ) {
      void dispatch(
        fetchProductsList({
          filters: { potterId: product.potterId },
          limit: 50,
          page: 1,
        })
      )
    }
  }, [
    dispatch,
    initialProductList,
    isSuccess,
    product?.potterId, // depend on the id, not the whole product object
    listIsLoading,
    listIsSuccess,
    listError, // block retries when there's an error
  ])

  // Derive related (assumes `allProducts` already filtered by potterId via API);
  // exclude the current product; optionally apply a *seeded* shuffle for stable variety.
  const relatedProducts = (() => {
    if (!product || !allProducts?.length) return []

    // exclude the current product
    const base = allProducts.filter((p) => p.id !== product.id)

    // --- Seeded shuffle for stable, deterministic variety ---
    // Seed idea: combine product id and the current date (UTC day) so it changes once per day per product.
    const seedStr = `${product.id}-${new Date().toISOString().slice(0, 10)}` // e.g., "47-2025-08-19"
    const seeded = base
      .map((item, idx) => {
        // simple deterministic hash -> number in [0,1)
        const h = Array.from(seedStr + idx).reduce(
          (acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0,
          0
        )
        // normalize hash to [0,1)
        const rand = ((h >>> 0) % 10000) / 10000
        return { item, rand }
      })
      .sort((a, b) => a.rand - b.rand)
      .map(({ item }) => item)

    return seeded.slice(0, 8)
  })()

  if (isLoading && !product) return <p className="p-8">{t('loading')}</p>
  if (!product && !isLoading && !isSuccess)
    return <p className="p-8 text-red-600">{error}</p>
  if (!product) return <p className="p-8 text-red-600">{error}</p>

  return (
    <ProductDetails
      product={product}
      locale={locale}
      potter={potter}
      relatedProducts={relatedProducts}
    />
  )
}

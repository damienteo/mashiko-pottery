'use client'

import { useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  hydrateProductsList,
  selectProductsListPagination,
  setProductsFilters,
  setProductsLimit,
  setProductsPage,
} from '@/store/products/productsListSlice'
import { fetchProductsList } from '@/store/thunks/fetchProductsList'
import { parseProductListSearchParams } from '@/lib/catalog/productListQuery'
import type { ProductListResult } from '@/lib/catalog/products'
import type { Locale } from '@/types/i18n'

export default function ProductsQuerySync({
  initialData,
  locale,
}: {
  initialData: ProductListResult
  locale: Locale
}) {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const pagination = useAppSelector(selectProductsListPagination)
  const hasSynced = useRef(false)

  useEffect(() => {
    if (hasSynced.current) return
    hasSynced.current = true

    const parsed = parseProductListSearchParams(searchParams, locale, {
      page: pagination.page ?? 1,
      limit: pagination.limit ?? 10,
    })

    if (!parsed.hasQuery) {
      dispatch(hydrateProductsList(initialData))
      return
    }

    dispatch(setProductsPage(parsed.page))
    dispatch(setProductsLimit(parsed.limit))
    dispatch(setProductsFilters(parsed.filters))
    void dispatch(
      fetchProductsList({
        page: parsed.page,
        limit: parsed.limit,
        filters: parsed.filters,
      })
    )
    // Sync once from the URL on mount; later filter/page changes go through
    // ProductsClient and pushQuery.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

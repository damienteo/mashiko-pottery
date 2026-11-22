'use client'

import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import type { ProductFilters } from '@/types/common'
import { useTranslations } from 'next-intl'

export type ProductsToolbarProps = {
  value: ProductFilters
  onSearch: (next: ProductFilters) => void
  categories?: string[]
  styles?: string[]
  showPotterId?: boolean
  page?: number
  totalPages?: number
  limit?: number
  onChangePage?: (page: number) => void
  onChangeLimit?: (limit: number) => void
}

type FormValues = {
  q: string
  category: string
  style: string
  active: '' | 'true' | 'false'
  priceMin: number | null
  priceMax: number | null
  potterId?: number | null
}

export default function ProductsToolbar({
  value,
  onSearch,
  categories = [],
  styles = [],
  showPotterId = false,
  page = 1,
  totalPages = 0,
  limit = 10,
  onChangePage = () => {},
  onChangeLimit = () => {},
}: ProductsToolbarProps) {
  const t = useTranslations('products.toolbar')

  // Map incoming filters -> RHF default values
  const defaultValues = useMemo<FormValues>(
    () => ({
      q: value.q ?? '',
      category: value.category ?? '',
      style: value.style ?? '',
      active:
        typeof value.active === 'boolean'
          ? value.active
            ? 'true'
            : 'false'
          : '',
      priceMin:
        typeof value.priceMin === 'number' && !Number.isNaN(value.priceMin)
          ? value.priceMin
          : null,
      priceMax:
        typeof value.priceMax === 'number' && !Number.isNaN(value.priceMax)
          ? value.priceMax
          : null,
      ...(showPotterId
        ? {
            potterId:
              typeof value.potterId === 'number' &&
              !Number.isNaN(value.potterId)
                ? value.potterId
                : null,
          }
        : {}),
    }),
    [
      value.q,
      value.category,
      value.style,
      value.active,
      value.priceMin,
      value.priceMax,
      value.potterId,
      showPotterId,
    ]
  )

  const initialDefaultsRef = useRef<FormValues>(defaultValues)

  const { register, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: initialDefaultsRef.current,
  })

  // Ensure no full-page navigation on submit
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // RHF's handleSubmit also calls preventDefault internally, but we double-guard here
    handleSubmit((data) => {
      console.log({ data })
      const next: ProductFilters = {
        ...value,
        q: data.q.trim() === '' ? null : data.q.trim(),
        category: data.category === '' ? null : data.category,
        style: data.style === '' ? null : data.style,
        active:
          data.active === '' ? null : data.active === 'true' ? true : false,
        priceMin: data.priceMin ?? null,
        priceMax:
          data.priceMax === null || data.priceMax === 0 ? null : data.priceMax,
        ...(showPotterId ? { potterId: data.potterId ?? null } : {}),
      }
      // Parent should set page=1 and fetch on filter changes to avoid double requests
      onSearch(next)
    })(e)
  }

  const onClear = () => {
    reset({
      q: '',
      category: '',
      style: '',
      active: '',
      priceMin: null,
      priceMax: null,
      ...(showPotterId ? { potterId: null } : {}),
    })
    onSearch({
      q: null,
      category: null,
      style: null,
      active: null,
      priceMin: null,
      priceMax: null,
      ...(showPotterId ? { potterId: null } : {}),
    })
  }

  return (
    <section className="px-4 py-4 sm:px-6 lg:px-8 bg-white/60 backdrop-blur">
      <form onSubmit={handleSearch} noValidate>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-3 items-end">
          {/* Search */}
          <div className="md:col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-name"
            >
              {t('search.label')}
            </label>
            <input
              id="pfb-name"
              type="text"
              {...register('q')}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault()
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder={t('search.placeholder')}
            />
          </div>

          {/* Category */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-category"
            >
              {t('category.label')}
            </label>
            <select
              id="pfb-category"
              {...register('category')}
              className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
            >
              <option value="">{t('category.all')}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Style */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-style"
            >
              {t('style.label')}
            </label>
            <select
              id="pfb-style"
              {...register('style')}
              className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
            >
              <option value="">{t('style.all')}</option>
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Active */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-active"
            >
              {t('active.label')}
            </label>
            <select
              id="pfb-active"
              {...register('active')}
              className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
            >
              <option value="">{t('active.all')}</option>
              <option value="true">{t('active.true')}</option>
              <option value="false">{t('active.false')}</option>
            </select>
          </div>

          {/* Price min */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-min"
            >
              {t('price.minLabel')}
            </label>
            <input
              id="pfb-min"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              {...register('priceMin', {
                setValueAs: (v) => (v === '' ? null : Number(v)),
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault()
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Price max */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="pfb-max"
            >
              {t('price.maxLabel')}
            </label>
            <input
              id="pfb-max"
              type="text"
              inputMode="numeric"
              pattern="\d*"
              {...register('priceMax', {
                setValueAs: (v) => (v === '' ? null : Number(v)),
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault()
              }}
              className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
          </div>

          {/* Potter ID (optional) */}
          {showPotterId && (
            <div>
              <label
                className="block text-sm font-medium text-gray-700 mb-1"
                htmlFor="pfb-potter"
              >
                {t('potter.label')}
              </label>
              <input
                id="pfb-potter"
                type="text"
                inputMode="numeric"
                pattern="\d*"
                {...register('potterId', {
                  setValueAs: (v) => (v === '' ? null : Number(v)),
                })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') e.preventDefault()
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder={t('potter.placeholder')}
              />
            </div>
          )}

          {/* Actions (Search/Clear) */}
          <div className="md:col-start-5 md:col-span-2 flex md:justify-end md:self-end">
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded bg-gray-900 text-white px-4 py-2 text-sm hover:bg-black"
              >
                {t('search.apply')}
              </button>
              <button
                type="button"
                onClick={onClear}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {t('clear')}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom row: page size + pagination */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 items-center">
          {/* Page size (left) */}
          <div className="flex items-center space-x-2">
            <label
              htmlFor="page-size"
              className="text-sm font-medium text-gray-700"
            >
              {t('pagination.pageSize')}
            </label>
            <select
              id="page-size"
              value={limit}
              onChange={(e) => onChangeLimit(Number(e.target.value))}
              className="rounded border border-gray-300 px-3 py-2 bg-white"
            >
              {[10, 20, 30, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Pagination controls */}
          <div className="mt-3 md:mt-0 flex justify-end items-center text-sm text-gray-700">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onChangePage(page - 1)}
              className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('pagination.prev')}
            </button>
            <span className="mx-4">
              {t('pagination.pageOf', {
                page,
                totalPages: Math.max(totalPages, 1),
              })}
            </span>
            <button
              type="button"
              disabled={page >= totalPages || totalPages === 0}
              onClick={() => onChangePage(page + 1)}
              className="rounded border border-gray-300 px-3 py-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('pagination.next')}
            </button>
          </div>
        </div>
      </form>
    </section>
  )
}

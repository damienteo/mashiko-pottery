'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, SubmitHandler } from 'react-hook-form'
import * as yup from 'yup'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  selectAdminProductListItems,
  selectAdminProductListLoading,
  selectAdminProductListError,
  selectAdminProductListFilters,
  selectAdminProductListPagination,
  setAdminProductFilters,
  setAdminProductPage,
  setAdminProductLimit,
} from '@/store/admin/productSlice'
import { fetchProductsList } from '@/store/thunks/fetchProductsList'
// import { useToast } from "@/components/ui/Toast";
import type { Locale } from '@/types/i18n'
import { formatYen } from '@/utils/format'

import ProductsToolbar from '@/components/products/ProductsToolbar'
import Button from '@/components/ui/Button'
import Image from 'next/image'
import Link from 'next/link'

const productSchema = yup.object({
  title: yup.string().required('Title is required'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .positive('Price must be greater than zero')
    .required('Price is required'),
  description: yup
    .string()
    .max(200, 'Max 200 characters')
    .required('Description is required'),
  stock: yup
    .number()
    .typeError('Inventory must be a number')
    .integer('Inventory must be an integer')
    .min(0, 'Inventory cannot be negative')
    .required('Inventory is required'),
})
type ProductFormValues = yup.InferType<typeof productSchema>

export default function ProductsClient() {
  const t = useTranslations('product.list')
  const locale = useLocale() as Locale
  const dispatch = useAppDispatch()
  const products = useAppSelector(selectAdminProductListItems)
  const isLoading = useAppSelector(selectAdminProductListLoading)
  const error = useAppSelector(selectAdminProductListError)
  const filters = useAppSelector(selectAdminProductListFilters)
  const pagination = useAppSelector(selectAdminProductListPagination)
  // const { success } = useToast();

  const [editingId, setEditingId] = useState<number | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProductFormValues>({
    mode: 'onChange',
    resolver: yupResolver(productSchema),
  })

  const onSubmit: SubmitHandler<ProductFormValues> = () => {
    // TODO: dispatch updateProduct({ id: editingId!, ...data });
    setEditingId(null)
  }

  const hasFetched = useRef(false)

  useEffect(() => {
    // Initial fetch only. Subsequent requests are driven by toolbar handlers.
    if (hasFetched.current) return
    hasFetched.current = true

    dispatch(
      fetchProductsList({
        page: pagination.page,
        limit: pagination.limit,
        filters: { ...filters, locale },
      })
    )
  }, [dispatch])

  if (error) {
    return (
      <div className="p-8 text-center text-red-600">
        <p>{t('error')}</p>
        <Button
          onClick={() => {
            void dispatch(
              fetchProductsList({
                page: pagination.page,
                limit: pagination.limit,
                filters: { ...filters, locale },
              })
            )
          }}
          className="mt-4"
        >
          {t('retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-8 space-y-6 max-w-7xl mx-auto bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center space-x-2">
        <span>{t('title')}</span>
        <span className="inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      {/* Controls: filter + pagination */}
      <ProductsToolbar
        value={filters}
        onSearch={(next) => {
          dispatch(setAdminProductFilters(next))
          dispatch(setAdminProductPage(1))
          dispatch(
            fetchProductsList({
              page: 1,
              limit: pagination.limit,
              filters: { ...next, locale },
            })
          )
        }}
        categories={['vase', 'cup', 'plate', 'bottle', 'bowl']}
        styles={['yakishime', 'shino', 'oribe']}
        showPotterId
        // Pagination wired into the bar
        page={pagination.page}
        totalPages={pagination.totalPages}
        limit={pagination.limit}
        onChangeLimit={(size) => {
          dispatch(setAdminProductLimit(size))
          dispatch(
            fetchProductsList({
              page: 1,
              limit: size,
              filters: { ...filters, locale },
            })
          )
        }}
        onChangePage={(pageNum) => {
          dispatch(setAdminProductPage(pageNum))
          dispatch(
            fetchProductsList({
              page: pageNum,
              limit: pagination.limit,
              filters: { ...filters, locale },
            })
          )
        }}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.image')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.title')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.price')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.description')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.stock')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.potterId')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.weight')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.category')}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  {t('loading')}
                </td>
              </tr>
            ) : (
              <>
                {products.map((p) => {
                  const loc = locale
                  const title = p.title?.[loc] ?? ''
                  const desc = p.description?.[loc] ?? ''
                  const imageSrc =
                    p.mainImage ||
                    (p.photos?.length
                      ? p.photos[0]
                      : '/images/placeholders/product-fallback.svg')

                  return (
                    <tr key={p.id}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <div className="w-12 h-12 relative">
                          <Image
                            src={imageSrc}
                            alt={title || 'Product image'}
                            fill
                            className="object-cover rounded"
                            sizes="48px"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {editingId === p.id ? (
                          <input
                            {...register('title')}
                            className="w-full border p-1 rounded text-sm"
                          />
                        ) : (
                          title
                        )}
                        {errors.title && editingId === p.id && (
                          <span className="text-red-600 text-xs">
                            {errors.title.message}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {editingId === p.id ? (
                          <input
                            type="number"
                            {...register('price')}
                            className="w-full border p-1 rounded text-sm"
                          />
                        ) : (
                          formatYen(p.price)
                        )}
                        {errors.price && editingId === p.id && (
                          <span className="text-red-600 text-xs">
                            {errors.price.message}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-600 line-clamp-2">
                        {editingId === p.id ? (
                          <textarea
                            {...register('description')}
                            rows={2}
                            className="w-full border p-1 rounded text-sm"
                          />
                        ) : (
                          desc
                        )}
                        {errors.description && editingId === p.id && (
                          <span className="text-red-600 text-xs">
                            {errors.description.message}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {editingId === p.id ? (
                          <input
                            type="number"
                            {...register('stock')}
                            className="w-20 border p-1 rounded text-sm"
                          />
                        ) : (
                          p.stock
                        )}
                        {errors.stock && editingId === p.id && (
                          <span className="text-red-600 text-xs">
                            {errors.stock.message}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {p.potterId}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {p.weight ?? '-'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        {p.category ?? '-'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium space-x-2 flex items-center">
                        {editingId === p.id ? (
                          <>
                            <Button
                              onClick={() => {
                                void handleSubmit(onSubmit)()
                              }}
                              variant="primary"
                              disabled={!isValid}
                            >
                              {t('actions.confirm')}
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                reset()
                                setEditingId(null)
                              }}
                            >
                              {t('actions.cancel')}
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                reset({
                                  title,
                                  price: p.price,
                                  description: desc,
                                  stock: p.stock,
                                })
                                setEditingId(p.id)
                              }}
                            >
                              {t('actions.edit')}
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                /* TODO: delete action */
                              }}
                            >
                              {t('actions.delete')}
                            </Button>
                            <Link
                              href={`/${locale}/admin/products/${p.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Button variant="secondary">
                                {t('actions.details')}
                              </Button>
                            </Link>
                          </>
                        )}
                      </td>
                    </tr>
                  )
                })}
                {products.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-6 text-center text-sm text-gray-500"
                    >
                      {t('empty')}
                    </td>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>
      </div>
      {/* end table */}
    </div>
  )
}

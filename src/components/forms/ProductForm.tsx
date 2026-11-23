'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { v4 as uuidv4 } from 'uuid'

import Button from '@/components/ui/Button'
import PhotoUploadField from '@/components/forms/PhotoUploadField'
import { useTranslations } from 'next-intl'
import {
  PRODUCT_CATEGORIES,
  productCategoryLabel,
} from '@/constants/productCategories'

export interface DraftProductFormValues {
  id?: number
  potterId: number
  title: {
    en: string
    ja: string
    zh: string
  }
  description: {
    en: string
    ja: string
    zh: string
  }
  price?: number
  stock?: number
  weight?: number
  lengthCm?: number
  widthCm?: number
  heightCm?: number
  leadTimeDays?: number
  photos: string[]
  mainImage?: string
  tags: string[]
  category?: string
  isDraft?: boolean
}

export interface ProductFormValues {
  id?: number
  potterId: number
  title: {
    en: string
    ja: string
    zh: string
  }
  description: {
    en: string
    ja: string
    zh: string
  }
  price: number
  stock: number
  weight: number
  lengthCm: number
  widthCm: number
  heightCm: number
  leadTimeDays?: number
  photos: string[]
  mainImage: string
  tags: string[]
  category: string
  isDraft: boolean
}

export type UnifiedFormValues = Partial<ProductFormValues> &
  Partial<DraftProductFormValues>

interface ProductFormProps {
  initialValues?: UnifiedFormValues
  onSubmit: (data: UnifiedFormValues) => unknown
  isLoading: boolean
  errorsFromServer?: string | null
  submitText?: string
}

const draftSchema: yup.ObjectSchema<DraftProductFormValues> = yup.object({
  id: yup.number().optional(),
  potterId: yup.number().required(),
  title: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  description: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  price: yup.number().min(0).optional(),
  stock: yup.number().min(0).optional(),
  weight: yup.number().optional(),
  lengthCm: yup.number().optional(),
  widthCm: yup.number().optional(),
  heightCm: yup.number().optional(),
  leadTimeDays: yup.number().optional(),
  photos: yup.array().of(yup.string().url().required()).required(),
  mainImage: yup.string().url().optional(),
  tags: yup.array().of(yup.string().required()).min(0).required(),
  category: yup.string().optional(),
  isDraft: yup.boolean().optional(),
})

const productSchema: yup.ObjectSchema<ProductFormValues> = yup.object({
  id: yup.number().optional(),
  potterId: yup.number().required(),
  title: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  description: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  price: yup.number().required().min(0),
  stock: yup.number().required().min(0),
  weight: yup.number().required(),
  lengthCm: yup.number().required(),
  widthCm: yup.number().required(),
  heightCm: yup.number().required(),
  leadTimeDays: yup.number().optional(),
  photos: yup.array().of(yup.string().url().required()).min(1).required(),
  mainImage: yup.string().url().required(),
  tags: yup.array().of(yup.string().required()).min(1).required(),
  category: yup.string().required(),
  isDraft: yup.boolean().required(),
})

const schema = yup.lazy(
  (values: DraftProductFormValues | ProductFormValues) => {
    return values?.isDraft ? draftSchema : productSchema
  }
)

export default function ProductForm({
  initialValues,
  onSubmit,
  isLoading,
  errorsFromServer,
  submitText,
}: ProductFormProps) {
  const t = useTranslations()
  const tCategory = useTranslations('products.categories')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UnifiedFormValues>({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  })

  useEffect(() => {
    if (initialValues) {
      reset(initialValues)
    }
  }, [initialValues, reset])

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
      className="space-y-4"
    >
      {initialValues?.id && (
        <input type="hidden" value={initialValues.id} {...register('id')} />
      )}
      <div>
        <label htmlFor="potterId" className="block font-medium mb-1">
          {t('product.create.potterId')}
        </label>
        <input
          id="potterId"
          type="number"
          {...register('potterId')}
          className="w-full p-2 border rounded"
        />
        {errors.potterId && (
          <p className="text-red-600 text-sm mt-1">{errors.potterId.message}</p>
        )}
      </div>

      <fieldset className="border p-3 rounded">
        <legend className="font-semibold mb-2">
          {t('product.create.titleSection')}
        </legend>
        {(['en', 'ja', 'zh'] as const).map((lang) => (
          <div key={lang} className="mb-2">
            <label htmlFor={`title.${lang}`} className="block font-medium mb-1">
              {t(`product.create.title.${lang}`)}
            </label>
            <input
              id={`title.${lang}`}
              {...register(`title.${lang}`)}
              className="w-full p-2 border rounded"
            />
            {errors.title?.[lang] && (
              <p className="text-red-600 text-sm mt-1">
                {errors.title[lang]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      <fieldset className="border p-3 rounded">
        <legend className="font-semibold mb-2">
          {t('product.create.descriptionSection')}
        </legend>
        {(['en', 'ja', 'zh'] as const).map((lang) => (
          <div key={lang} className="mb-2">
            <label
              htmlFor={`description.${lang}`}
              className="block font-medium mb-1"
            >
              {t(`product.create.description.${lang}`)}
            </label>
            <textarea
              id={`description.${lang}`}
              {...register(`description.${lang}`)}
              rows={3}
              className="w-full p-2 border rounded"
            />
            {errors.description?.[lang] && (
              <p className="text-red-600 text-sm mt-1">
                {errors.description[lang]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      <div>
        <label htmlFor="price" className="block font-medium mb-1">
          {t('product.create.price')}
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          {...register('price')}
          className="w-full p-2 border rounded"
        />
        {errors.price && (
          <p className="text-red-600 text-sm mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="stock" className="block font-medium mb-1">
          {t('product.create.stock')}
        </label>
        <input
          id="stock"
          type="number"
          {...register('stock')}
          className="w-full p-2 border rounded"
        />
        {errors.stock && (
          <p className="text-red-600 text-sm mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="weight" className="block font-medium mb-1">
          {t('product.create.weight')}
        </label>
        <input
          id="weight"
          type="number"
          step="0.1"
          {...register('weight')}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="lengthCm" className="block font-medium mb-1">
          {t('product.create.lengthCm')}
        </label>
        <input
          id="lengthCm"
          type="number"
          step="0.1"
          {...register('lengthCm')}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="widthCm" className="block font-medium mb-1">
          {t('product.create.widthCm')}
        </label>
        <input
          id="widthCm"
          type="number"
          step="0.1"
          {...register('widthCm')}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="heightCm" className="block font-medium mb-1">
          {t('product.create.heightCm')}
        </label>
        <input
          id="heightCm"
          type="number"
          step="0.1"
          {...register('heightCm')}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="leadTimeDays" className="block font-medium mb-1">
          {t('product.create.leadTimeDays')}
        </label>
        <input
          id="leadTimeDays"
          type="number"
          {...register('leadTimeDays')}
          className="w-full p-2 border rounded"
        />
      </div>

      <PhotoUploadField<UnifiedFormValues>
        name="mainImage"
        control={control}
        label={t('product.create.mainImage')}
        multiple={false}
        getPublicId={() =>
          initialValues?.id
            ? `products/${initialValues.id}/main`
            : `drafts/products/${uuidv4()}`
        }
      />

      <PhotoUploadField<UnifiedFormValues>
        name="photos"
        control={control}
        label={t('product.create.photos')}
        multiple
        getPublicId={() =>
          initialValues?.id
            ? `products/${initialValues.id}/images`
            : `drafts/products/${uuidv4()}`
        }
      />

      <div>
        <label htmlFor="tags" className="block font-medium mb-1">
          {t('product.create.tags')}
        </label>
        <input
          id="tags"
          type="text"
          {...register('tags')}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="category" className="block font-medium mb-1">
          {t('product.create.category')}
        </label>
        <select
          id="category"
          {...register('category')}
          className="w-full p-2 border rounded bg-white"
        >
          <option value="" />
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {productCategoryLabel(tCategory, c)}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <input id="isDraft" type="checkbox" {...register('isDraft')} />
        <label htmlFor="isDraft" className="font-medium">
          {t('product.create.isDraft')}
        </label>
      </div>

      <Button type="submit" disabled={isLoading || isSubmitting}>
        {submitText ?? t('product.create.submit')}
      </Button>
      {errorsFromServer && (
        <p className="text-red-600 text-sm mt-2">{errorsFromServer}</p>
      )}
    </form>
  )
}

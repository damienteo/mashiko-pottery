'use client'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { v4 as uuidv4 } from 'uuid'

import Button from '@/components/ui/Button'
import { useTranslations } from 'next-intl'
import PhotoUploadField from '@/components/forms/PhotoUploadField'

export interface PotterFormValues {
  userId?: string
  name: {
    en: string
    ja: string
    zh: string
  }
  bio: {
    en: string
    ja: string
    zh: string
  }
  style: string
  imageUrl?: string
  photos?: string[]
  active?: boolean
  isDraft?: boolean
}

interface PotterFormProps {
  initialValues?: PotterFormValues
  onSubmit: (data: PotterFormValues) => unknown
  isLoading: boolean
  errorsFromServer?: string | null
  submitText?: string
  showUserIdInput?: boolean // ← new: show a visible input
  requireUserId?: boolean // ← new: make it required via validation
}

const schema: yup.ObjectSchema<PotterFormValues> = yup.object({
  userId: yup.string().when('$requireUserId', {
    is: true,
    then: (schema) => schema.required('User ID is required'),
    otherwise: (schema) => schema.optional(),
  }),
  name: yup.object({
    en: yup.string().required('English name is required'),
    ja: yup.string().required('Japanese name is required'),
    zh: yup.string().required('Chinese name is required'),
  }),
  bio: yup.object({
    en: yup.string().required('English bio is required'),
    ja: yup.string().required('Japanese bio is required'),
    zh: yup.string().required('Chinese bio is required'),
  }),
  style: yup.string().required('Style is required'),
  imageUrl: yup.string().optional(),
  photos: yup.array().of(yup.string().url().required()).required(),
  active: yup.boolean().optional(),
  isDraft: yup.boolean().optional(),
})

export default function PotterForm({
  initialValues,
  onSubmit,
  isLoading,
  errorsFromServer,
  submitText,
  showUserIdInput = false,
  requireUserId = false,
}: PotterFormProps) {
  const t = useTranslations()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
  } = useForm<PotterFormValues>({
    resolver: yupResolver(schema, { context: { requireUserId } }),
    defaultValues: initialValues,
  })

  return (
    <form
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
      className="space-y-4"
    >
      <div>
        {showUserIdInput && (
          <label htmlFor="userId" className="block text-sm">
            {t('potter.create.userId')}
          </label>
        )}
        <input
          id="userId"
          type={showUserIdInput ? 'text' : 'hidden'}
          {...register('userId')}
          className={showUserIdInput ? 'w-full p-2 border rounded' : undefined}
        />
        {showUserIdInput && errors.userId && (
          <p className="text-red-600 text-sm">{errors.userId.message}</p>
        )}
      </div>

      {/* Localized Name */}
      <fieldset className="space-y-2">
        <legend className="font-semibold mb-1">
          {t('potter.create.name')}
        </legend>
        {(['en', 'ja', 'zh'] as const).map((lang) => (
          <div key={lang}>
            <label htmlFor={`name.${lang}`} className="block text-sm">
              {t(`potter.create.name${lang.toUpperCase()}`)}
            </label>
            <input
              id={`name.${lang}`}
              {...register(`name.${lang}`)}
              className="w-full p-2 border rounded"
            />
            {errors.name?.[lang] && (
              <p className="text-red-600 text-sm">
                {errors.name[lang]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      {/* Localized Bio */}
      <fieldset className="space-y-2">
        <legend className="font-semibold mb-1">{t('potter.create.bio')}</legend>
        {(['en', 'ja', 'zh'] as const).map((lang) => (
          <div key={lang}>
            <label htmlFor={`bio.${lang}`} className="block text-sm">
              {t(`potter.create.bio${lang.toUpperCase()}`)}
            </label>
            <textarea
              id={`bio.${lang}`}
              {...register(`bio.${lang}`)}
              rows={3}
              className="w-full p-2 border rounded"
            />
            {errors.bio?.[lang] && (
              <p className="text-red-600 text-sm">
                {errors.bio[lang]?.message}
              </p>
            )}
          </div>
        ))}
      </fieldset>

      <div>
        <label htmlFor="style" className="block mb-1">
          {t('potter.create.style')}
        </label>
        <input
          id="style"
          {...register('style')}
          className="w-full p-2 border rounded"
        />
        {errors.style && (
          <p className="text-red-600 text-sm">{errors.style.message}</p>
        )}
      </div>

      <PhotoUploadField<PotterFormValues>
        name="imageUrl"
        control={control}
        label={t('potter.create.imageUrl')}
        multiple={false}
        getPublicId={() =>
          initialValues?.userId
            ? `potters/${initialValues.userId}/main`
            : `drafts/potters/${uuidv4()}`
        }
      />

      <PhotoUploadField<PotterFormValues>
        name="photos"
        control={control}
        label={t('potter.create.photos')}
        multiple
        getPublicId={() =>
          initialValues?.userId
            ? `potters/${initialValues.userId}/photos`
            : `drafts/potters/${uuidv4()}`
        }
      />

      <div>
        <label htmlFor="active" className="block mb-1">
          {t('potter.create.active')}
        </label>
        <input
          id="active"
          type="checkbox"
          {...register('active')}
          className="mr-2"
        />
        <span>{t('potter.create.activeLabel')}</span>
      </div>

      <div>
        <label htmlFor="isDraft" className="block mb-1">
          {t('potter.create.isDraft')}
        </label>
        <input
          id="isDraft"
          type="checkbox"
          {...register('isDraft')}
          className="mr-2"
        />
        <span>{t('potter.create.isDraftLabel')}</span>
      </div>

      <Button
        type="submit"
        disabled={isLoading || isSubmitting}
        className="w-full"
      >
        {isLoading || isSubmitting
          ? t('potter.create.submitting')
          : (submitText ?? t('potter.create.submit'))}
      </Button>

      {errorsFromServer && (
        <p className="text-red-600 mt-2 text-sm">{errorsFromServer}</p>
      )}
    </form>
  )
}

'use client'

import React from 'react'
import Image from 'next/image'
import { Control, FieldErrors, UseFormRegister, Path } from 'react-hook-form'
import { InitialConfigType } from '@lexical/react/LexicalComposer'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import RichTextField from '@/components/ui/RichTextField'
import { localeLabels } from '@/constants/localeLabels'
import { ProfileFormValues } from '../SellerProfileClient' // Ensure this is exported

type SellerProfileFormProps = {
  onCancel: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  control: Control<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
  isValid: boolean
  t: ReturnType<typeof useTranslations>
  register: UseFormRegister<ProfileFormValues>
  editorConfig: InitialConfigType
}

export function SellerProfileForm({
  onCancel,
  onSubmit,
  control,
  errors,
  isValid,
  t,
  register,
  editorConfig,
}: SellerProfileFormProps) {
  return (
    <div className="mt-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">{t('title')}</h1>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['en', 'ja', 'zh'] as const).map((loc) => (
            <div key={loc}>
              <label className="block text-sm font-medium">
                {t('fields.name')} ({localeLabels[loc]})
              </label>
              <input
                {...register(`name.${loc}` as Path<ProfileFormValues>)}
                className="mt-1 block w-full border p-2 rounded"
              />
              {errors.name?.[loc] && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.name[loc]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['en', 'ja', 'zh'] as const).map((loc) => (
            <RichTextField
              key={loc}
              control={control}
              name={`bio.${loc}` as Path<ProfileFormValues>}
              label={`${t('fields.bio')} (${localeLabels[loc]})`}
              error={errors.bio?.[loc]?.message}
              editorConfig={editorConfig}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['en', 'ja', 'zh'] as const).map((loc) => (
            <div key={loc}>
              <label className="block text-sm font-medium">
                {t('fields.portfolio')} ({localeLabels[loc]})
              </label>
              <input
                {...register(`portfolio.${loc}` as Path<ProfileFormValues>)}
                className="mt-1 block w-full border p-2 rounded"
              />
              {errors.portfolio?.[loc] && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.portfolio[loc]?.message}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {control._formValues.createdAt && (
            <div>
              <label className="block text-sm font-medium">
                {t('fields.createdAt')}
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(control._formValues.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {control._formValues.updatedAt && (
            <div>
              <label className="block text-sm font-medium">
                {t('fields.updatedAt')}
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(control._formValues.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {control._formValues.image && (
            <div>
              <label className="block text-sm font-medium">
                {t('fields.image')}
              </label>
              <Image
                src={control._formValues.image}
                alt="Profile"
                width={128}
                height={128}
                className="rounded object-cover border"
              />
            </div>
          )}
          {control._formValues.createdAt && (
            <div>
              <label className="block text-sm font-medium">
                {t('fields.createdAt')}
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(control._formValues.createdAt).toLocaleDateString()}
              </p>
            </div>
          )}
          {control._formValues.updatedAt && (
            <div>
              <label className="block text-sm font-medium">
                {t('fields.updatedAt')}
              </label>
              <p className="mt-1 text-sm text-gray-600">
                {new Date(control._formValues.updatedAt).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <Button type="submit" variant="primary" disabled={!isValid}>
            {t('actions.save')}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            {t('actions.cancel')}
          </Button>
        </div>
      </form>
    </div>
  )
}

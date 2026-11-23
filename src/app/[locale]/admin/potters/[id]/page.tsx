'use client'

import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useTranslations, useLocale } from 'next-intl'

import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchAdminPotter,
  updateAdminPotter,
  selectAdminPotterLoading,
  selectAdminPotterError,
  selectAdminPotter,
} from '@/store/admin/potterSlice'

import PotterForm from '@/components/forms/PotterForm'
import type { PotterFormValues } from '@/components/forms/PotterForm'
import { useToast } from '@/components/ui/Toast'

export default function AdminPotterDetail() {
  const { id } = useParams()
  const locale = useLocale()
  const t = useTranslations('admin.pages.potters')
  const dispatch = useAppDispatch()
  const potter = useAppSelector(selectAdminPotter)
  const { success, error: toastError } = useToast()

  const isLoading = useAppSelector(selectAdminPotterLoading)
  const error = useAppSelector(selectAdminPotterError)

  const hasFetched = useRef(false)
  useEffect(() => {
    if (!hasFetched.current && id) {
      dispatch(fetchAdminPotter(Number(id)))
      hasFetched.current = true
    }
  }, [dispatch, id])

  const defaults: PotterFormValues = potter
    ? {
        userId: potter.userId ?? '',
        name: {
          en: potter.name['en'] ?? '',
          ja: potter.name['ja'] ?? '',
          zh: potter.name['zh'] ?? '',
        },
        bio: {
          en: potter.bio['en'] ?? '',
          ja: potter.bio['ja'] ?? '',
          zh: potter.bio['zh'] ?? '',
        },
        style: {
          en: potter.style?.en ?? '',
          ja: potter.style?.ja ?? '',
          zh: potter.style?.zh ?? '',
        },
        imageUrl: potter.imageUrl ?? '',
        photos: potter.photos ?? [],
        active: potter.active ?? true,
        isDraft: potter.isDraft ?? false,
      }
    : {
        userId: '',
        name: { en: '', ja: '', zh: '' },
        bio: { en: '', ja: '', zh: '' },
        style: { en: '', ja: '', zh: '' },
        imageUrl: '',
        photos: [],
        active: true,
        isDraft: false,
      }

  if (!potter && !isLoading && hasFetched.current) {
    return <p>{t('error')}</p>
  }

  const onSubmit = async (data: PotterFormValues) => {
    const resultAction = await dispatch(updateAdminPotter(data))
    if (updateAdminPotter.fulfilled.match(resultAction)) {
      success(t('potter.update.success'))
    } else {
      toastError(error || t('potter.update.error'))
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>
          {t('title')} –{' '}
          {defaults.name[locale as 'en' | 'ja' | 'zh'] || defaults.name.ja}
        </span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <PotterForm
        initialValues={defaults}
        onSubmit={onSubmit}
        submitText={t('action.save')}
        isLoading={isLoading}
        errorsFromServer={error}
      />
    </div>
  )
}

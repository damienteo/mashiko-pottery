'use client'

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchSellerProfile,
  updateSellerProfile,
  selectSellerProfile,
  selectSellerLoading,
  selectSellerError,
} from '@/store/seller/sellerSlice'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
import { SellerProfileForm } from './components/SellerProfileForm'
import { SellerProfileView } from './components/SellerProfileView'

const editorConfig = {
  namespace: 'SellerProfileBio',
  theme: {},
  nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode],
  onError: (error: Error) => console.error(error),
}

const profileSchema = yup.object({
  name: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
  bio: yup.object({
    en: yup.string().max(2000, 'Max 2000 characters').required(),
    ja: yup.string().max(2000, '最大2000文字').required(),
    zh: yup.string().max(2000, '最多2000个字符').required(),
  }),
  portfolio: yup.object({
    en: yup
      .string()
      .max(1000, 'Max 1000 characters')
      .required('Portfolio is required'),
    ja: yup
      .string()
      .max(1000, '最大1000文字')
      .required('Portfolio is required'),
    zh: yup
      .string()
      .max(1000, '最多1000个字符')
      .required('Portfolio is required'),
  }),
  style: yup.object({
    en: yup.string().required(),
    ja: yup.string().required(),
    zh: yup.string().required(),
  }),
})
export type ProfileFormValues = yup.InferType<typeof profileSchema>

export default function SellerProfileClient() {
  const t = useTranslations('seller.profile')
  const [isEditing, setIsEditing] = useState(false)
  const dispatch = useAppDispatch()

  const profile = useAppSelector(selectSellerProfile)
  const isLoading = useAppSelector(selectSellerLoading)
  const error = useAppSelector(selectSellerError)

  // Load profile on mount
  useEffect(() => {
    if (!profile && !isLoading) {
      dispatch(fetchSellerProfile())
    }
  }, [dispatch, profile, isLoading])

  // Prepare default values once profile arrives
  const defaults: ProfileFormValues = profile
    ? {
        name: {
          en: profile.name?.en ?? '',
          ja: profile.name?.ja ?? '',
          zh: profile.name?.['zh'] ?? '',
        },
        bio: {
          en: profile.bio?.en ?? '',
          ja: profile.bio?.ja ?? '',
          zh: profile.bio?.['zh'] ?? '',
        },
        portfolio: {
          en: profile.portfolio?.en ?? '',
          ja: profile.portfolio?.ja ?? '',
          zh: profile.portfolio?.['zh'] ?? '',
        },
        style: {
          en: profile.style?.en ?? '',
          ja: profile.style?.ja ?? '',
          zh: profile.style?.['zh'] ?? '',
        },
      }
    : {
        name: { en: '', ja: '', zh: '' },
        bio: { en: '', ja: '', zh: '' },
        portfolio: { en: '', ja: '', zh: '' },
        style: { en: '', ja: '', zh: '' },
      }

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<ProfileFormValues>({
    mode: 'onChange',
    resolver: yupResolver(profileSchema),
    defaultValues: defaults,
  })

  // Reset form when profile changes
  useEffect(() => {
    if (profile) {
      reset(defaults)
    }
  }, [profile, reset])

  if (isLoading) {
    return <p className="p-8">{t('loading')}</p>
  }

  if (error) {
    return <p className="p-8 text-red-600">{t('error')}</p>
  }

  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    dispatch(updateSellerProfile(data))
    setIsEditing(false)
  }

  if (!isEditing) {
    return <SellerProfileView onEdit={() => setIsEditing(true)} />
  }

  return (
    <SellerProfileForm
      onCancel={() => {
        reset(defaults)
        setIsEditing(false)
      }}
      onSubmit={(e) => {
        void handleSubmit(onSubmit)(e)
      }}
      control={control}
      errors={errors}
      isValid={isValid}
      t={t}
      register={register}
      editorConfig={editorConfig}
    />
  )
}

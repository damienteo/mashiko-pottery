'use client'

import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'

import Button from '@/components/ui/Button'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  signInWithPasswordOrOtp,
  selectAuthLoading,
  selectAuthError,
} from '@/store/user/authSlice'

interface Props {
  callback: string
}

interface FormData {
  email: string
  callback?: string
}

const schema = yup.object({
  email: yup
    .string()
    .required('validation.email.required')
    .email('validation.email.invalid'),
})

// TODO:
// Client-side cooldown on submission
// API rate limitting
// CAPCHA

export default function LoginClient({ callback }: Props) {
  const t = useTranslations('common')
  const dispatch = useAppDispatch()
  const isLoading = useAppSelector(selectAuthLoading)
  const authError = useAppSelector(selectAuthError)
  const [emailSent, setEmailSent] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const result = await dispatch(
      signInWithPasswordOrOtp({ email: data.email, callback })
    )
    if (signInWithPasswordOrOtp.fulfilled.match(result)) {
      setEmailSent(true)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 p-8 border rounded shadow-sm bg-white">
      <h1 className="text-2xl font-bold mb-6">{t('login.title')}</h1>

      {emailSent && (
        <div className="text-center space-y-4">
          <p>
            {t('login.magicLinkSent')} {t('login.checkYourInbox')}
          </p>
        </div>
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="on"
      >
        <div>
          <label htmlFor="email" className="block mb-1">
            {t('login.email')}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={`w-full p-2 border rounded ${errors.email ? 'border-red-600' : ''}`}
          />
          {errors.email?.message && (
            <p className="text-red-600 mt-1">{t(errors.email.message)}</p>
          )}
        </div>
        {authError && <p className="text-red-600 text-sm">{authError}</p>}
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full"
        >
          {isSubmitting || isLoading
            ? t('login.sending')
            : t('login.sendMagicLink')}
        </Button>
      </form>
    </div>
  )
}

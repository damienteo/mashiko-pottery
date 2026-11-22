'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchPayoutDetails,
  selectPayoutDetails,
  updatePayoutDetails,
} from '@/store/payouts/payoutDetailsSlice'
import { useForm, SubmitHandler } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Button from '@/components/ui/Button'
import { payoutStatusOptions, PayoutStatus } from '@/constants/payoutStatus'

const payoutSchema = yup.object({
  potterId: yup.string().required(),
  month: yup.string().required(),
  amount: yup.number().min(0).required(),
  commissionRate: yup.number().min(0).max(1).required(),
  status: yup.mixed<PayoutStatus>().oneOf(payoutStatusOptions).required(),
})
type PayoutFormValues = yup.InferType<typeof payoutSchema>

export default function AdminPayoutDetailPage() {
  const { id } = useParams()
  const t = useTranslations('admin.pages.payouts')
  const dispatch = useAppDispatch()
  const details = useAppSelector(selectPayoutDetails)

  useEffect(() => {
    dispatch(fetchPayoutDetails(id as string))
  }, [dispatch, id])

  // Derive defaults once details are loaded
  const defaults: PayoutFormValues = details
    ? {
        potterId: details.potterId,
        month: details.month,
        amount: details.amount,
        commissionRate: details.commissionRate,
        status: details.status,
      }
    : {
        potterId: '',
        month: '',
        amount: 0,
        commissionRate: 0,
        status: 'Processing',
      }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<PayoutFormValues>({
    mode: 'onChange',
    resolver: yupResolver(payoutSchema),
    defaultValues: defaults,
  })

  useEffect(() => {
    if (details) {
      reset(defaults)
    }
  }, [details, reset])

  if (!details) {
    return <p className="p-8">{t('loading')}</p>
  }

  const onSubmit: SubmitHandler<PayoutFormValues> = (data) => {
    dispatch(updatePayoutDetails({ id: id as string, updates: data }))
  }

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-50 border-l-4 border-yellow-500">
      <h1 className="text-2xl font-bold text-yellow-700 flex items-center mb-4">
        <span>
          {t('title')} – {details.month} | {details.potterId}
        </span>
        <span className="ml-2 inline-block px-2 py-0.5 text-xs font-semibold bg-yellow-200 text-yellow-800 rounded">
          Admin
        </span>
      </h1>
      <form
        onSubmit={(e) => {
          void handleSubmit(onSubmit)(e)
        }}
        className="space-y-4"
      >
        {/* Potter ID (read-only) */}
        <div>
          <label className="block text-sm font-medium">
            {t('table.potterId')}
          </label>
          <input
            type="text"
            {...register('potterId')}
            disabled
            className="mt-1 block w-full border p-2 rounded bg-white"
          />
        </div>
        {/* Month (read-only) */}
        <div>
          <label className="block text-sm font-medium">
            {t('table.month')}
          </label>
          <input
            {...register('month')}
            disabled
            className="mt-1 block w-full border p-2 rounded bg-white"
          />
        </div>
        {/* Amount */}
        <div>
          <label className="block text-sm font-medium">
            {t('table.amount')}
          </label>
          <input
            type="number"
            {...register('amount')}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          />
          {errors.amount && (
            <p className="text-red-600 text-xs mt-1">{errors.amount.message}</p>
          )}
        </div>
        {/* Commission Rate */}
        <div>
          <label className="block text-sm font-medium">
            {t('table.commissionRate')}
          </label>
          <input
            type="number"
            step="0.01"
            {...register('commissionRate')}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          />
          {errors.commissionRate && (
            <p className="text-red-600 text-xs mt-1">
              {errors.commissionRate.message}
            </p>
          )}
        </div>
        {/* Commission Amount (computed) */}
        {details.commissionAmount != null && (
          <div>
            <label className="block text-sm font-medium">
              {t('table.commissionAmount')}
            </label>
            <p className="mt-1 text-gray-700">
              ¥{details.commissionAmount.toLocaleString()}
            </p>
          </div>
        )}

        {/* Net Amount (computed) */}
        {details.netAmount != null && (
          <div>
            <label className="block text-sm font-medium">
              {t('table.netAmount')}
            </label>
            <p className="mt-1 text-gray-700">
              ¥{details.netAmount.toLocaleString()}
            </p>
          </div>
        )}
        {/* Status */}
        <div>
          <label className="block text-sm font-medium">
            {t('table.status')}
          </label>
          <select
            {...register('status')}
            className="mt-1 block w-full border p-2 rounded bg-white focus:bg-gray-100"
          >
            {payoutStatusOptions.map((st) => (
              <option key={st} value={st}>
                {st.charAt(0).toUpperCase() + st.slice(1)}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>
          )}
        </div>
        <Button type="submit" variant="primary" disabled={!isValid}>
          {t('actions.save')}
        </Button>
        <Button type="button" variant="secondary" onClick={() => reset()}>
          {t('actions.cancel')}
        </Button>
      </form>
    </div>
  )
}

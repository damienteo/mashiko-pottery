'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  fetchSellerPayoutDetails,
  selectSellerPayoutDetails,
  selectSellerPayoutDetailsLoading,
  selectSellerPayoutDetailsError,
  selectSellerPayoutDetailsSuccess,
} from '@/store/seller/sellerPayoutDetailsSlice'
import { useTranslations } from 'next-intl'
import Button from '@/components/ui/Button'
import StatusBadge from '@/components/ui/StatusBadge'
import { formatYen } from '@/utils/format'

export default function SellerPayoutDetailsClient() {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const t = useTranslations('seller.payouts')

  const payout = useAppSelector(selectSellerPayoutDetails)
  const isLoading = useAppSelector(selectSellerPayoutDetailsLoading)
  const error = useAppSelector(selectSellerPayoutDetailsError)
  const isSuccess = useAppSelector(selectSellerPayoutDetailsSuccess)

  useEffect(() => {
    if (id) {
      dispatch(fetchSellerPayoutDetails(id))
    }
  }, [dispatch, id])

  if (!isLoading && !isSuccess && !error) {
    return null
  }

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (!isSuccess || error || !payout) {
    return (
      <div className="p-8 text-center text-red-600 space-y-4">
        <p>{t('error')}</p>
        <Button
          onClick={() => {
            void dispatch(fetchSellerPayoutDetails(id))
          }}
        >
          {t('retry')}
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-8 bg-white shadow-md rounded-md space-y-6">
      <h1 className="text-xl font-bold text-blue-700">{t('details.title')}</h1>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-semibold text-gray-600">{t('table.id')}:</span>{' '}
          <span className="text-gray-800">{payout.id}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t('table.amount')}:
          </span>{' '}
          <span className="text-gray-800">{formatYen(payout.amount)}</span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t('table.status')}:
          </span>{' '}
          <StatusBadge status={payout.status} type="payout" />
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t('table.createdAt')}:
          </span>{' '}
          <span className="text-gray-800">
            {payout.createdAt
              ? new Date(payout.createdAt).toLocaleString()
              : '-'}
          </span>
        </div>
        <div>
          <span className="font-semibold text-gray-600">
            {t('table.paidAt')}:
          </span>{' '}
          <span className="text-gray-800">
            {payout.paidAt ? new Date(payout.paidAt).toLocaleString() : '-'}
          </span>
        </div>
        {payout.commissionRate !== undefined && (
          <div>
            <span className="font-semibold text-gray-600">
              {t('table.commissionRate')}:
            </span>{' '}
            <span className="text-gray-800">{payout.commissionRate}%</span>
          </div>
        )}
        {payout.commissionAmount !== undefined && (
          <div>
            <span className="font-semibold text-gray-600">
              {t('table.commissionAmount')}:
            </span>{' '}
            <span className="text-gray-800">
              {formatYen(payout.commissionAmount)}
            </span>
          </div>
        )}
        {payout.netAmount !== undefined && (
          <div>
            <span className="font-semibold text-gray-600">
              {t('table.netAmount')}:
            </span>{' '}
            <span className="text-gray-800">{formatYen(payout.netAmount)}</span>
          </div>
        )}
        {payout.breakdown?.totalOrders !== undefined && (
          <div>
            <span className="font-semibold text-gray-600">
              {t('table.totalOrders')}:
            </span>{' '}
            <span className="text-gray-800">
              {payout.breakdown.totalOrders}
            </span>
          </div>
        )}
        {payout.breakdown?.totalFees !== undefined && (
          <div>
            <span className="font-semibold text-gray-600">
              {t('table.totalFees')}:
            </span>{' '}
            <span className="text-gray-800">
              {formatYen(payout.breakdown.totalFees)}
            </span>
          </div>
        )}
        {payout.breakdown?.notes && (
          <div className="col-span-2">
            <span className="font-semibold text-gray-600">
              {t('table.notes')}:
            </span>
            <p className="text-gray-800 whitespace-pre-line">
              {payout.breakdown.notes}
            </p>
          </div>
        )}
      </div>
      <div className="pt-4">
        <Button onClick={() => router.back()} variant="secondary">
          {t('back')}
        </Button>
      </div>
    </div>
  )
}

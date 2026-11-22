export type PayoutStatus =
  | 'Queued'
  | 'Processing'
  | 'Paid'
  | 'Failed'
  | 'OnHold'
  | 'Cancelled'
  | 'Refunded'

export const payoutStatusOptions: PayoutStatus[] = [
  'Queued',
  'Processing',
  'Paid',
  'Failed',
  'OnHold',
  'Cancelled',
  'Refunded',
]

export const payoutStatusBadgeClasses: Record<PayoutStatus, string> = {
  Queued: 'bg-gray-100 text-gray-800',
  Processing: 'bg-yellow-100 text-yellow-800',
  Paid: 'bg-green-100 text-green-800',
  Failed: 'bg-red-100 text-red-800',
  OnHold: 'bg-orange-100 text-orange-800',
  Cancelled: 'bg-gray-200 text-gray-700',
  Refunded: 'bg-blue-100 text-blue-800',
}

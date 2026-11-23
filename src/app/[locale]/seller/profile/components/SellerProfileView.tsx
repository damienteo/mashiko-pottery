'use client'

import Image from 'next/image'
import { useAppSelector } from '@/store/hooks'
import { selectSellerProfile } from '@/store/seller/sellerSlice'
import { useTranslations } from 'next-intl'
import { localeLabels } from '@/constants/localeLabels'
import { asLocalized } from '@/lib/catalog/serialize'
import RichTextViewer from '@/components/ui/RichTextViewer'
import Button from '@/components/ui/Button'

type SellerProfileViewProps = {
  onEdit: () => void
}

export function SellerProfileView({ onEdit }: SellerProfileViewProps) {
  const t = useTranslations('seller.profile')
  const profile = useAppSelector(selectSellerProfile)

  return (
    <div className="mt-8 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">{t('title')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['en', 'ja', 'zh'] as const).map((loc) => (
          <div key={loc}>
            <h2 className="font-medium">
              {t('fields.name')} ({localeLabels[loc]})
            </h2>
            <p>{profile?.name[loc]}</p>
          </div>
        ))}
      </div>

      {profile?.image && (
        <div>
          <h2 className="font-medium">{t('fields.image')}</h2>
          <Image
            src={profile.image}
            alt="Profile"
            width={128}
            height={128}
            className="rounded object-cover border"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['en', 'ja', 'zh'] as const).map((loc) => {
          const styleText = asLocalized(profile?.style)[loc]
          if (!styleText) return null
          return (
            <div key={loc}>
              <h2 className="font-medium">
                {t('fields.style')} ({localeLabels[loc]})
              </h2>
              <p>{styleText}</p>
            </div>
          )
        })}
      </div>

      {profile?.active !== undefined && (
        <div>
          <h2 className="font-medium">{t('fields.active')}</h2>
          <p>{profile.active ? t('status.active') : t('status.inactive')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['en', 'ja', 'zh'] as const).map((loc) => (
          <div key={loc}>
            <h2 className="font-medium">
              {t('fields.bio')} ({localeLabels[loc]})
            </h2>
            <RichTextViewer html={profile?.bio[loc] || ''} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(['en', 'ja', 'zh'] as const).map((loc) => (
          <div key={loc}>
            <h2 className="font-medium">
              {t('fields.portfolio')} ({localeLabels[loc]})
            </h2>
            <p>{profile?.portfolio[loc]}</p>
          </div>
        ))}
      </div>

      <div className="text-sm text-gray-500">
        {profile?.createdAt && (
          <p>
            {t('fields.createdAt')}:{' '}
            {new Date(profile.createdAt).toLocaleDateString()}
          </p>
        )}
        {profile?.updatedAt && (
          <p>
            {t('fields.updatedAt')}:{' '}
            {new Date(profile.updatedAt).toLocaleDateString()}
          </p>
        )}
      </div>

      <Button variant="primary" onClick={onEdit}>
        {t('actions.edit')}
      </Button>
    </div>
  )
}

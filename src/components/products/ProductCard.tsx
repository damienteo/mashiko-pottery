'use client'

import { useTranslations } from 'next-intl'
import SmartImage from '@/components/ui/SmartImage'
import IntentLink from '@/components/ui/IntentLink'

import type { Product } from '@/types/product'
import type { Locale } from '@/types/i18n'
import { formatYen } from '@/utils/format'

export type ProductCardVariant = 'default' | 'compact'

export interface ProductCardProps {
  product: Product
  locale: Locale
  href?: string
  variant?: ProductCardVariant
}

const FALLBACK_IMG = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=' // 1x1 transparent pixel

export default function ProductCard({
  product,
  locale,
  href,
  variant = 'default',
}: ProductCardProps) {
  const t = useTranslations('product')

  const title = product.title?.[locale] ?? ''
  const description = product.description?.[locale] ?? ''
  const compact = variant === 'compact'
  const soldOut = product.stock === 0

  const imageSrc = product.mainImage || product.photos?.[0] || FALLBACK_IMG
  const productHref = href ?? `/${locale}/products/${product.id}`

  return (
    <article className="group flex flex-col h-full">
      <IntentLink
        href={productHref}
        className="block"
        aria-label={title || 'Product'}
      >
        <div className="relative w-full aspect-square overflow-hidden rounded-lg bg-gray-100">
          <SmartImage
            src={imageSrc}
            alt={title || 'Product image'}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.05]"
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
            priority={false}
          />
          {soldOut ? (
            <span className="absolute top-2 left-2 rounded bg-gray-900/80 px-2 py-0.5 text-xs font-medium text-white">
              {t('soldOut')}
            </span>
          ) : null}
        </div>
        <div className="mt-3 flex flex-col items-center text-center">
          <h3 className="text-2xl leading-snug font-serif line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-800">{formatYen(product.price)}</p>
          {!compact && !!description && (
            <p className="mt-1 text-md text-justify text-gray-600 line-clamp-4">
              {description}
            </p>
          )}
        </div>
      </IntentLink>
    </article>
  )
}

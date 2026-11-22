'use client'

import Image, { type ImageProps } from 'next/image'
import { resolveSmartImageLoader } from '@/lib/smartImageLoader'

function isUnoptimizedSrc(src: ImageProps['src']): boolean {
  return typeof src === 'string' && /^(data:|blob:)/.test(src)
}

/**
 * Local files use Next's default `/_next/image` optimiser. Cloudinary URLs
 * use `cloudinaryLoader` inside this client module so a loader function is
 * never passed across the server/client boundary.
 */
export default function SmartImage({ alt, src, ...props }: ImageProps) {
  if (isUnoptimizedSrc(src)) {
    return <Image {...props} src={src} alt={alt} unoptimized />
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      loader={
        typeof src === 'string' ? resolveSmartImageLoader(src) : undefined
      }
    />
  )
}

'use client'

import Image, { type ImageProps } from 'next/image'
import cloudinaryLoader from '@/lib/cloudinaryLoader'

function isCloudinarySrc(src: ImageProps['src']): boolean {
  return typeof src === 'string' && src.includes('res.cloudinary.com')
}

/**
 * `next/image` wrapper. Cloudinary URLs use the custom loader (function stays
 * in this Client Component). Local files use the default optimizer.
 */
export default function SmartImage({ alt, src, ...props }: ImageProps) {
  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      loader={isCloudinarySrc(src) ? cloudinaryLoader : undefined}
    />
  )
}

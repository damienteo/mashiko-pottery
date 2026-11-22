import Image, { type ImageProps } from 'next/image'

/** Server-safe `next/image`. The Cloudinary loader lives in next.config. */
export default function SmartImage({ alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} />
}

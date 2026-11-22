import Image, { type ImageProps } from 'next/image'

/**
 * `next/image` wrapper. Cloudinary transforms come from the global
 * `images.loaderFile` in next.config.ts so this file can stay a Server
 * Component (passing a loader function here would force a client boundary).
 */
export default function SmartImage({ alt, ...props }: ImageProps) {
  return <Image {...props} alt={alt} />
}

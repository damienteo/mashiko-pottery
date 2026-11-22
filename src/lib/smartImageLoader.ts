import cloudinaryLoader from '@/lib/cloudinaryLoader'

export function isCloudinarySrc(src: string): boolean {
  return src.includes('res.cloudinary.com')
}

export function resolveSmartImageLoader(
  src: string
): typeof cloudinaryLoader | undefined {
  return isCloudinarySrc(src) ? cloudinaryLoader : undefined
}

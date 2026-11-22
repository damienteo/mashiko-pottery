import type { ImageLoaderProps } from 'next/image'

/**
 * next/image loader for Cloudinary URLs only (wired from SmartImage).
 * Local files must keep the default optimiser; this function returns
 * them unchanged if it is ever called with a non-Cloudinary src.
 */
export default function cloudinaryLoader({
  src,
  width,
  quality,
}: ImageLoaderProps): string {
  try {
    const url = new URL(src)
    if (url.hostname !== 'res.cloudinary.com') {
      return src
    }

    const segments = url.pathname.split('/').filter(Boolean)
    const uploadIdx = segments.indexOf('upload')
    if (uploadIdx === -1) {
      return src
    }

    const afterUpload = segments.slice(uploadIdx + 1)
    const first = afterUpload[0] ?? ''
    const firstIsVersion = /^v\d+$/.test(first)
    const firstIsTransform =
      !firstIsVersion && (first.includes(',') || /^[a-z]{1,4}_/.test(first))
    const publicIdParts = firstIsTransform ? afterUpload.slice(1) : afterUpload

    const q = typeof quality === 'number' ? String(quality) : 'auto'
    const transform = `f_auto,q_${q},w_${width},c_limit`
    url.pathname = `/${[
      ...segments.slice(0, uploadIdx + 1),
      transform,
      ...publicIdParts,
    ].join('/')}`
    return url.toString()
  } catch {
    return src
  }
}

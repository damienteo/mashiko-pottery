import { getImageProps } from 'next/image'
import { preload } from 'react-dom'
import { resolveSmartImageLoader } from '@/lib/smartImageLoader'

export const GALLERY_MAIN_SIZES = '(min-width: 768px) 50vw, 100vw'

const preloaded = new Set<string>()

export function preloadGalleryMainImage(src: string): void {
  if (!src || preloaded.has(src)) return

  const loader = resolveSmartImageLoader(src)
  const { props } = getImageProps({
    alt: '',
    src,
    fill: true,
    sizes: GALLERY_MAIN_SIZES,
    loader,
  })

  preload(props.src, {
    as: 'image',
    imageSrcSet: props.srcSet,
    imageSizes: props.sizes,
  })
  preloaded.add(src)
}

/** @internal Clears preload dedupe cache (tests only). */
export function resetGalleryPreloadCacheForTests(): void {
  preloaded.clear()
}

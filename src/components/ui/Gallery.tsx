'use client'

import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useTranslations } from 'next-intl'
import SmartImage from '@/components/ui/SmartImage'
import {
  GALLERY_MAIN_SIZES,
  preloadGalleryMainImage,
} from '@/lib/galleryImagePreload'

export type GalleryProps = {
  images: string[]
  title?: string
  imagePriority?: boolean
  /** Accessible label for the loading spinner overlay */
  loadingLabel?: string
}

const SPINNER_DELAY_MS = 150

const Gallery: React.FC<GalleryProps> = ({
  images,
  title = 'Product image',
  imagePriority = false,
  loadingLabel,
}) => {
  const t = useTranslations('common')
  const spinnerLabel = loadingLabel ?? t('loading')

  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const [incomingVisible, setIncomingVisible] = useState(true)
  const [showSpinner, setShowSpinner] = useState(false)

  const spinnerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const currentIndexRef = useRef(currentIndex)
  currentIndexRef.current = currentIndex

  const isTransitioning = currentIndex !== displayedIndex

  const currentImage = useMemo(
    () => images?.[currentIndex] || '',
    [images, currentIndex]
  )
  const displayedImage = useMemo(
    () => images?.[displayedIndex] || '',
    [images, displayedIndex]
  )

  const clearSpinnerTimer = useCallback(() => {
    if (spinnerTimerRef.current) {
      clearTimeout(spinnerTimerRef.current)
      spinnerTimerRef.current = null
    }
  }, [])

  const preloadNext = useCallback(
    (index: number) => {
      const next = images[index + 1]
      if (next) preloadGalleryMainImage(next)
    },
    [images]
  )

  const finishTransition = useCallback(
    (index: number) => {
      clearSpinnerTimer()
      setShowSpinner(false)
      setDisplayedIndex(index)
      setIncomingVisible(true)
      preloadNext(index)
    },
    [clearSpinnerTimer, preloadNext]
  )

  const handleIncomingLoad = useCallback(
    (index: number) => {
      if (index !== currentIndexRef.current) return
      setIncomingVisible(true)
      finishTransition(index)
    },
    [finishTransition]
  )

  const handleIncomingError = useCallback(
    (index: number) => {
      if (index !== currentIndexRef.current) return
      finishTransition(index)
    },
    [finishTransition]
  )

  useEffect(() => {
    if (!isTransitioning) {
      clearSpinnerTimer()
      setShowSpinner(false)
      return
    }

    setIncomingVisible(false)
    clearSpinnerTimer()
    spinnerTimerRef.current = setTimeout(() => {
      setShowSpinner(true)
    }, SPINNER_DELAY_MS)

    return () => {
      clearSpinnerTimer()
    }
  }, [isTransitioning, currentIndex, clearSpinnerTimer])

  useEffect(() => {
    if (!isTransitioning && displayedIndex === 0) {
      preloadNext(0)
    }
  }, [isTransitioning, displayedIndex, preloadNext])

  const selectImage = useCallback((idx: number) => {
    setCurrentIndex(idx)
  }, [])

  const warmThumbnail = useCallback((src: string) => {
    preloadGalleryMainImage(src)
  }, [])

  if (!images || images.length === 0) return null

  const thumbHandlers = (src: string) => ({
    onMouseEnter: () => warmThumbnail(src),
    onFocus: () => warmThumbnail(src),
    onTouchStart: () => warmThumbnail(src),
  })

  const mainPriority = !isTransitioning && currentIndex === 0 && imagePriority
  const mainFetchPriority = mainPriority ? ('high' as const) : ('auto' as const)

  return (
    <>
      <div className="md:flex md:items-start md:gap-4">
        {currentImage && (
          <>
            <div className="relative w-full aspect-square overflow-hidden rounded md:flex-1">
              {isTransitioning && displayedImage && (
                <div
                  className="absolute inset-0 opacity-50 transition-opacity duration-300"
                  aria-hidden
                >
                  <SmartImage
                    src={displayedImage}
                    alt=""
                    fill
                    className="object-cover"
                    sizes={GALLERY_MAIN_SIZES}
                    priority={false}
                  />
                </div>
              )}
              <div
                className={`absolute inset-0 transition-opacity duration-300 ${
                  isTransitioning && !incomingVisible
                    ? 'opacity-0'
                    : 'opacity-100'
                }`}
              >
                <SmartImage
                  key={currentIndex}
                  src={currentImage}
                  alt={title || 'Product image'}
                  fill
                  className="object-cover"
                  sizes={GALLERY_MAIN_SIZES}
                  priority={mainPriority}
                  fetchPriority={mainFetchPriority}
                  onLoad={() => handleIncomingLoad(currentIndex)}
                  onError={() => handleIncomingError(currentIndex)}
                />
              </div>
              {showSpinner && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  role="status"
                  aria-live="polite"
                >
                  <span className="sr-only">{spinnerLabel}</span>
                  <div
                    className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin"
                    aria-hidden
                  />
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="hidden md:flex flex-col gap-3 overflow-y-auto max-h-[480px] w-20 thumbnail-scroll">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => selectImage(idx)}
                    className={`relative w-16 h-16 rounded overflow-hidden border-2 focus:outline-none ${
                      idx === currentIndex
                        ? 'border-gray-400'
                        : 'border-transparent'
                    }`}
                    aria-label={t('gallery.selectImage', { n: idx + 1 })}
                    aria-current={idx === currentIndex ? 'true' : undefined}
                    title={t('gallery.selectImage', { n: idx + 1 })}
                    {...thumbHandlers(img)}
                  >
                    <SmartImage
                      src={img}
                      alt={`${title || 'Product'} thumbnail ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                      priority={false}
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="md:hidden mt-4 flex gap-3 overflow-x-auto thumbnail-scroll">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectImage(idx)}
              className={`relative w-20 h-20 flex-shrink-0 rounded overflow-hidden border-2 focus:outline-none ${
                idx === currentIndex ? 'border-gray-400' : 'border-transparent'
              }`}
              aria-label={t('gallery.selectImage', { n: idx + 1 })}
              aria-current={idx === currentIndex ? 'true' : undefined}
              title={t('gallery.selectImage', { n: idx + 1 })}
              {...thumbHandlers(img)}
            >
              <SmartImage
                src={img}
                alt={`${title || 'Product'} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                priority={false}
              />
            </button>
          ))}
        </div>
      )}
    </>
  )
}

export default Gallery

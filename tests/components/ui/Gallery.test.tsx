/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, act } from '@testing-library/react'
import Gallery from '@/components/ui/Gallery'
import { resetGalleryPreloadCacheForTests } from '@/lib/galleryImagePreload'

const mockPreload = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string, values?: { n?: number }) => {
      if (key === 'loading') return 'Loading…'
      if (key === 'gallery.selectImage') return `Select image ${values?.n}`
      return key
    }
    return t
  },
}))

jest.mock('react-dom', () => {
  const actual = jest.requireActual<typeof import('react-dom')>('react-dom')
  return {
    ...actual,
    preload: (...args: unknown[]) => mockPreload(...args),
  }
})

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({
    onLoad,
    onError,
    alt,
    src,
    className,
  }: {
    onLoad?: () => void
    onError?: () => void
    alt?: string
    src: string
    className?: string
  }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        alt={alt}
        className={className}
        data-gallery-src={src}
        onLoad={onLoad}
        onError={onError}
      />
    )
  },
  getImageProps: jest.fn(({ src }: { src: string }) => ({
    props: {
      src: `optimized:${src}`,
      srcSet: `optimized:${src} 1x`,
      sizes: '(min-width: 768px) 50vw, 100vw',
    },
  })),
}))

const images = ['/a.webp', '/b.webp', '/c.webp']

function mainAreaImages(container: HTMLElement) {
  const main = container.querySelector('.aspect-square')
  if (!main) return []
  return Array.from(
    main.querySelectorAll<HTMLImageElement>('img[data-gallery-src]')
  )
}

function findMainImageForSrc(container: HTMLElement, src: string) {
  return mainAreaImages(container).find((img) => img.dataset.gallerySrc === src)
}

describe('Gallery', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    mockPreload.mockClear()
    resetGalleryPreloadCacheForTests()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('shows spinner after thumbnail click and hides it after load', () => {
    const { container } = render(<Gallery images={images} title="Item" />)

    fireEvent.click(screen.getAllByLabelText('Select image 2')[0])

    expect(screen.queryByRole('status')).not.toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(150)
    })

    expect(screen.getByRole('status')).toHaveTextContent('Loading…')

    const incoming = findMainImageForSrc(container, '/b.webp')
    expect(incoming).toBeDefined()
    act(() => {
      fireEvent.load(incoming!)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('hides spinner after image error', () => {
    const { container } = render(<Gallery images={images} title="Item" />)

    fireEvent.click(screen.getAllByLabelText('Select image 2')[0])
    act(() => {
      jest.advanceTimersByTime(150)
    })

    const incoming = findMainImageForSrc(container, '/b.webp')
    act(() => {
      fireEvent.error(incoming!)
    })

    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('preloads the main image on thumbnail hover', () => {
    render(<Gallery images={images} title="Item" />)

    const thumb = screen.getAllByLabelText('Select image 3')[0]
    fireEvent.mouseEnter(thumb)

    expect(mockPreload).toHaveBeenCalledWith(
      'optimized:/c.webp',
      expect.objectContaining({
        as: 'image',
        imageSrcSet: 'optimized:/c.webp 1x',
      })
    )
  })

  it('marks the selected thumbnail with aria-current', () => {
    render(<Gallery images={images} title="Item" />)

    const second = screen.getAllByLabelText('Select image 2')[0]
    fireEvent.click(second)

    expect(second).toHaveAttribute('aria-current', 'true')
    expect(screen.getAllByLabelText('Select image 1')[0]).not.toHaveAttribute(
      'aria-current'
    )
  })
})

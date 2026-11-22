/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import FeaturedCollections from '@/components/home/FeaturedCollections'
import type { Product } from '@/types/product'

jest.mock('next-intl/server', () => ({
  getTranslations: async () => (key: string) => key,
  getLocale: async () => 'en',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt, src }: { alt?: string; src: string }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} src={src} />
    )
  },
}))

jest.mock('@/components/ui/SmartImage', () => ({
  __esModule: true,
  default: function MockSmartImage({
    alt,
    src,
  }: {
    alt?: string
    src: string
  }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} src={src} />
    )
  },
}))

jest.mock('@/components/ui/IntentLink', () => ({
  __esModule: true,
  default: function MockIntentLink({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) {
    return <a href={href}>{children}</a>
  },
}))

const sampleProduct: Product = {
  id: 42,
  potterId: 1,
  title: { en: 'Shino bowl', ja: '志野碗', zh: '志野碗' },
  description: {
    en: 'A wheel-thrown bowl.',
    ja: 'ろくろ成形の碗。',
    zh: '拉坯碗。',
  },
  price: 8800,
  photos: ['/products/bowl.webp'],
  mainImage: '/products/bowl.webp',
  tags: [],
  isDraft: false,
}

describe('FeaturedCollections', () => {
  it('renders an empty-state message when there are no products', async () => {
    render(await FeaturedCollections({ products: [] }))
    expect(screen.getByText('featured.empty')).toBeInTheDocument()
    expect(screen.queryByText('Shino bowl')).not.toBeInTheDocument()
    expect(
      screen.getByRole('link', { name: 'featured.viewAll' })
    ).toHaveAttribute('href', '/en/products')
    expect(screen.getByText('featured.empty')).toHaveClass('min-h-64')
  })

  it('renders compact cards with image, title, and price but not the description', async () => {
    render(await FeaturedCollections({ products: [sampleProduct] }))
    expect(screen.getByRole('img', { name: 'Shino bowl' })).toHaveAttribute(
      'src',
      '/products/bowl.webp'
    )
    expect(screen.getByText('Shino bowl')).toBeInTheDocument()
    expect(screen.getByText('￥8,800')).toBeInTheDocument()
    expect(screen.queryByText('A wheel-thrown bowl.')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Shino bowl/ })).toHaveAttribute(
      'href',
      '/en/products/42'
    )
    expect(screen.queryByText('featured.empty')).not.toBeInTheDocument()
    const grid = screen
      .getByText('Shino bowl')
      .closest('article')?.parentElement
    expect(grid).toHaveClass('grid-cols-1', 'sm:grid-cols-3')
    expect(grid).not.toHaveClass('sm:grid-cols-2')
  })
})

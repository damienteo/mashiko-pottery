/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/types/product'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: function MockImage({ alt }: { alt?: string }) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img alt={alt} />
    )
  },
}))

jest.mock('@/components/ui/IntentLink', () => ({
  __esModule: true,
  default: function MockLink({
    href,
    children,
  }: {
    href: string
    children: React.ReactNode
  }) {
    return <a href={href}>{children}</a>
  },
}))

const product: Product = {
  id: 7,
  potterId: 1,
  title: { en: 'Cedar Bowl', ja: 'cedar', zh: 'cedar' },
  description: {
    en: 'A long description that must not appear on compact cards.',
    ja: '',
    zh: '',
  },
  price: 2500,
  photos: [],
  tags: [],
  isDraft: false,
  stock: 0,
}

describe('ProductCard', () => {
  it('shows a sold-out badge when stock is 0', () => {
    render(<ProductCard product={product} locale="en" variant="compact" />)
    expect(screen.getByText('soldOut')).toBeInTheDocument()
  })

  it('omits the description in the compact variant', () => {
    render(<ProductCard product={product} locale="en" variant="compact" />)
    expect(
      screen.queryByText(
        'A long description that must not appear on compact cards.'
      )
    ).not.toBeInTheDocument()
    expect(screen.getByText('Cedar Bowl')).toBeInTheDocument()
    expect(screen.getByText('￥2,500')).toBeInTheDocument()
  })

  it('shows the description in the default variant', () => {
    render(<ProductCard product={product} locale="en" />)
    expect(
      screen.getByText(
        'A long description that must not appear on compact cards.'
      )
    ).toBeInTheDocument()
  })

  it('does not show a sold-out badge when stock is available', () => {
    render(
      <ProductCard
        product={{ ...product, stock: 3 }}
        locale="en"
        variant="compact"
      />
    )
    expect(screen.queryByText('soldOut')).not.toBeInTheDocument()
  })
})

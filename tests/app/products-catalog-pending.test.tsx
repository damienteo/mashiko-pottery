/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import ProductsCatalog from '@/app/[locale]/products/ProductsCatalog'
import { PENDING_UI_DELAY_MS } from '@/components/navigation/pendingUi'
import type { ProductListResult } from '@/lib/catalog/products'

const push = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  usePathname: () => '/ja/products',
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/components/products/ProductsToolbar', () => ({
  __esModule: true,
  default: function MockToolbar({
    onChangePage,
  }: {
    onChangePage: (page: number) => void
  }) {
    return (
      <button type="button" onClick={() => onChangePage(2)}>
        next-page
      </button>
    )
  },
}))

jest.mock('@/components/products/ProductGrid', () => ({
  __esModule: true,
  default: function MockGrid() {
    return <div>product-grid</div>
  },
}))

let fetchGate: (value: ProductListResult) => void = () => {}

jest.mock('@/lib/catalog/fetchProductList', () => ({
  fetchProductListFromApi: () =>
    new Promise<ProductListResult>((resolve) => {
      fetchGate = resolve
    }),
}))

const initialData: ProductListResult = {
  products: [
    {
      id: 1,
      potterId: 1,
      title: { en: 'Cup', ja: '碗', zh: '碗' },
      description: { en: '', ja: '', zh: '' },
      price: 1000,
      photos: [],
      tags: [],
      isDraft: false,
    },
  ],
  filters: {
    q: null,
    locale: 'ja',
    category: null,
    style: null,
    active: null,
    priceMin: null,
    priceMax: null,
    potterId: null,
  },
  pagination: { page: 1, limit: 10, total: 1, totalPages: 2 },
}

describe('ProductsCatalog pending grid', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    push.mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('dims the current grid after the delay while a filter request is in flight', async () => {
    render(
      <ProductsCatalog
        initialData={initialData}
        locale="ja"
        serverGrid={<div>server-grid</div>}
      />
    )

    fireEvent.click(screen.getByText('next-page'))
    expect(screen.getByText('server-grid').parentElement).not.toHaveClass(
      'opacity-60'
    )

    act(() => {
      jest.advanceTimersByTime(PENDING_UI_DELAY_MS)
    })

    expect(screen.getByText('server-grid').parentElement).toHaveClass(
      'opacity-60'
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByRole('status').nextElementSibling).toHaveClass(
      'sticky',
      'top-[33vh]'
    )

    await act(async () => {
      fetchGate({
        ...initialData,
        pagination: { ...initialData.pagination, page: 2 },
      })
    })
  })
})

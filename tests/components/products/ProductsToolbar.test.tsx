/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { readFileSync } from 'fs'
import { join } from 'path'
import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import ProductsToolbar from '@/components/products/ProductsToolbar'
import { emptyProductFilters } from '@/lib/catalog/productListQuery'

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const t = (key: string) => key
    t.has = () => true
    return t
  },
}))

const baseValue = emptyProductFilters()

describe('ProductsToolbar', () => {
  it('submits the form when Enter is pressed in search and price inputs', async () => {
    const onSearch = jest.fn()
    render(
      <ProductsToolbar
        value={baseValue}
        onSearch={onSearch}
        categories={['vase']}
        showStyle={false}
        showActive={false}
      />
    )

    const search = screen.getByLabelText('search.label')
    fireEvent.change(search, { target: { value: 'bowl' } })
    fireEvent.keyDown(search, { key: 'Enter', code: 'Enter', charCode: 13 })
    fireEvent.submit(search.closest('form') as HTMLFormElement)

    await waitFor(() =>
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'bowl' })
      )
    )

    onSearch.mockClear()
    const max = screen.getByLabelText('price.maxLabel')
    fireEvent.change(max, { target: { value: '5000' } })
    fireEvent.keyDown(max, { key: 'Enter', code: 'Enter', charCode: 13 })
    fireEvent.submit(max.closest('form') as HTMLFormElement)

    await waitFor(() =>
      expect(onSearch).toHaveBeenCalledWith(
        expect.objectContaining({ q: 'bowl', priceMax: 5000 })
      )
    )
  })

  it('does not swallow Enter on search or price fields', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/components/products/ProductsToolbar.tsx'),
      'utf8'
    )
    expect(src).not.toMatch(/if \(e\.key === 'Enter'\) e\.preventDefault\(\)/)
  })

  it('re-syncs form fields when URL-derived filters change', () => {
    const onSearch = jest.fn()
    const { rerender } = render(
      <ProductsToolbar
        value={baseValue}
        onSearch={onSearch}
        categories={['vase']}
        showStyle={false}
        showActive={false}
      />
    )

    expect(screen.getByLabelText('search.label')).toHaveValue('')

    rerender(
      <ProductsToolbar
        value={{ ...baseValue, q: 'vase', priceMin: 1000 }}
        onSearch={onSearch}
        categories={['vase']}
        showStyle={false}
        showActive={false}
      />
    )

    expect(screen.getByLabelText('search.label')).toHaveValue('vase')
    expect(screen.getByLabelText('price.minLabel')).toHaveValue('1000')
  })

  it('hides style and active controls on the public toolbar', () => {
    render(
      <ProductsToolbar
        value={baseValue}
        onSearch={jest.fn()}
        categories={['vase', 'cup']}
        showStyle={false}
        showActive={false}
      />
    )

    expect(screen.queryByLabelText('style.label')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('active.label')).not.toBeInTheDocument()
    expect(screen.getByLabelText('category.label')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'vase' })).toHaveValue('vase')
  })

  it('keeps style and active controls when shown (admin)', () => {
    render(
      <ProductsToolbar
        value={baseValue}
        onSearch={jest.fn()}
        categories={['vase']}
        styles={['oribe']}
        showStyle
        showActive
      />
    )

    expect(screen.getByLabelText('style.label')).toBeInTheDocument()
    expect(screen.getByLabelText('active.label')).toBeInTheDocument()
  })
})

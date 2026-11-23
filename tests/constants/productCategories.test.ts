import { readFileSync } from 'fs'
import { join } from 'path'
import {
  PRODUCT_CATEGORIES,
  productCategoryLabel,
} from '@/constants/productCategories'

const read = (rel: string) => readFileSync(join(process.cwd(), rel), 'utf8')

describe('PRODUCT_CATEGORIES', () => {
  it('lists production category values in one shared constant', () => {
    expect([...PRODUCT_CATEGORIES]).toEqual([
      'vase',
      'cup',
      'plate',
      'bowl',
      'bottle',
      'lidded',
      'teapot',
      'planter',
      'donabe',
    ])
  })

  it('is used by public, potter, admin, and product form pickers', () => {
    const files = [
      'src/app/[locale]/products/ProductsCatalog.tsx',
      'src/app/[locale]/potters/[id]/PotterProductsCatalog.tsx',
      'src/app/[locale]/admin/products/ProductsClient.tsx',
      'src/components/forms/ProductForm.tsx',
      'src/components/products/ProductsToolbar.tsx',
    ]
    for (const file of files) {
      expect(read(file)).toMatch(/PRODUCT_CATEGORIES/)
      expect(read(file)).not.toMatch(
        /\['vase',\s*'cup',\s*'plate',\s*'bottle',\s*'bowl'\]/
      )
    }
  })

  it('translates known keys and falls back to the stored value', () => {
    const t = Object.assign((key: string) => `label:${key}`, {
      has: (key: string) => key === 'donabe',
    })
    expect(productCategoryLabel(t, 'donabe')).toBe('label:donabe')
    expect(productCategoryLabel(t, 'unknown')).toBe('unknown')
    expect(productCategoryLabel(t, '')).toBe('')
  })
})

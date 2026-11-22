import ProductCard from '@/components/products/ProductCard'
import type { Product } from '@/types/product'
import type { Locale } from '@/types/i18n'

export default function ProductGrid({
  products,
  locale,
  className = 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8',
}: {
  products: Product[]
  locale: Locale
  className?: string
}) {
  return (
    <div className={className}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} locale={locale} />
      ))}
    </div>
  )
}

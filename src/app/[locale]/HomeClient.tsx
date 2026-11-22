import Hero from '@/components/home/Hero'
import FeaturedCollections from '@/components/home/FeaturedCollections'
import HowItWorks from '@/components/home/HowItWorks'
import PotterSpotlights from '@/components/home/PotterSpotlights'
import ShippingGuarantee from '@/components/home/ShippingGuarantee'
import Testimonials from '@/components/home/Testimonials'
import NewsletterSignup from '@/components/home/NewsletterSignup'
import type { Potter } from '@/types/potter'
import type { Product } from '@/types/product'

export default function HomeClient({
  initialPotters,
  featuredProducts,
}: {
  initialPotters: Potter[]
  featuredProducts: Product[]
}) {
  return (
    <>
      <Hero />
      <FeaturedCollections products={featuredProducts} />
      <HowItWorks />
      <PotterSpotlights potters={initialPotters} />
      <ShippingGuarantee />
      <Testimonials />
      <NewsletterSignup />
    </>
  )
}

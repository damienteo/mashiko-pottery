import dynamic from 'next/dynamic'
import Hero from '@/components/home/Hero'
import FeaturedCollections from '@/components/home/FeaturedCollections'
import HowItWorks from '@/components/home/HowItWorks'
import PotterSpotlights from '@/components/home/PotterSpotlights'
import ShippingGuarantee from '@/components/home/ShippingGuarantee'
import Testimonials from '@/components/home/Testimonials'
import type { Potter } from '@/types/potter'

const NewsletterSignup = dynamic(
  () => import('@/components/home/NewsletterSignup')
)

export default function HomeClient({
  initialPotters,
}: {
  initialPotters: Potter[]
}) {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <HowItWorks />
      <PotterSpotlights potters={initialPotters} />
      <ShippingGuarantee />
      <Testimonials />
      <NewsletterSignup />
    </>
  )
}

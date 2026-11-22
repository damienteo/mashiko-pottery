import Hero from '@/components/home/Hero'
import FeaturedCollections from '@/components/home/FeaturedCollections'
import HowItWorks from '@/components/home/HowItWorks'
import PotterSpotlights from '@/components/home/PotterSpotlights'
import ShippingGuarantee from '@/components/home/ShippingGuarantee'
import Testimonials from '@/components/home/Testimonials'
import NewsletterSignup from '@/components/home/NewsletterSignup'

export default function HomeClient() {
  return (
    <>
      <Hero />
      <FeaturedCollections />
      <HowItWorks />
      <PotterSpotlights />
      <ShippingGuarantee />
      <Testimonials />
      <NewsletterSignup />
    </>
  )
}

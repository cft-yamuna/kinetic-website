import HeroSection from "@/components/hero-section"
import ProductShowcase from "@/components/product-showcase"
import SocialProof from "@/components/social-proof"
import BookingSection from "@/components/booking-section"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import Preloader from "@/components/preloader"
import CustomCursor from "@/components/custom-cursor"
import FloatingCTA from "@/components/floating-cta"
import PromoBanner from "@/components/promo-banner"

export default function HomePage() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <div className="smooth-scroll">
        <PromoBanner />
        <Navigation />
        <FloatingCTA />
        <main>
          <HeroSection />
          <SocialProof />
          <ProductShowcase />
          <BookingSection />
        </main>
        <Footer />
      </div>
    </>
  )
}

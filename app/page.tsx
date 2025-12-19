import HeroSection from "@/components/hero-section"
import ProductShowcase from "@/components/product-showcase"
import GridPatternSection from "@/components/grid-pattern-section"
import BookingSection from "@/components/booking-section"
import Footer from "@/components/footer"
import Navigation from "@/components/navigation"
import Preloader from "@/components/preloader"
import CustomCursor from "@/components/custom-cursor"
import FloatingCTA from "@/components/floating-cta"

export default function HomePage() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <div className="smooth-scroll">
        <Navigation />
        <FloatingCTA />
        <main>
          <HeroSection />
          <ProductShowcase />
          <GridPatternSection />
          <BookingSection />
        </main>
        <Footer />
      </div>
    </>
  )
}

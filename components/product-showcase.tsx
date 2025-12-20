"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"
import { Play, ArrowRight } from "lucide-react"
import Link from "next/link"

// Global mobile state hook with hydration safety
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Only return true for mobile after hydration to avoid mismatch
  return hasMounted && isMobile
}

const products = [
  {
    id: 1,
    title: "Rotating LED Panels",
    category: "Retail & Events",
    image: "/1.png",
    youtubeId: "gAQQzblPFl8",
    isPortrait: false,
    description: "360-degree rotating screens that follow your audience",
    stats: "3M+ Views",
    motion: "Full Rotation",
  },
  {
    id: 2,
    title: "Flip Display System",
    category: "Corporate Lobbies",
    image: "/2.png",
    youtubeId: "i7nf18eXCiA",
    isPortrait: true,
    description: "Synchronized flip mechanism for dramatic reveals",
    stats: "50+ Installations",
    motion: "180° Flip",
  },
  {
    id: 3,
    title: "Wave Motion Wall",
    category: "Museums & Galleries",
    image: "/3.png",
    youtubeId: "_NJCho098f4",
    isPortrait: true,
    description: "Undulating LED panels creating mesmerizing patterns",
    stats: "Award Winning",
    motion: "Wave Pattern",
  },
]

function FeaturedCard({ product }: { product: typeof products[0] }) {
  // All hooks must be called unconditionally at the top
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })
  const isMobile = useIsMobile()

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Mobile version - static card
  if (isMobile) {
    return (
      <div
        ref={cardRef}
        className="relative group cursor-pointer col-span-full lg:col-span-8 row-span-2"
      >
        <div className="relative h-[400px] md:h-[450px] lg:h-full lg:min-h-[500px] rounded-2xl overflow-hidden">
          <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <div className="absolute inset-0">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              sizes="(max-width: 768px) 100vw, 66vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
          <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
            <Play className="h-4 w-4 text-white fill-white" />
          </div>
          <div className="absolute top-4 left-4 bg-sunbeam text-black text-xs font-bold px-3 py-1 rounded-full">
            {product.motion}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <span className="text-xs uppercase tracking-wider text-sunbeam mb-2 block">
              {product.category}
            </span>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {product.title}
            </h3>
            <p className="text-white/70 text-sm md:text-base mb-4 max-w-md">
              {product.description}
            </p>
          </div>
          <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
        </div>
      </div>
    )
  }

  // Desktop version with animations
  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer col-span-full lg:col-span-8 row-span-2"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-[400px] md:h-[450px] lg:h-full lg:min-h-[500px] rounded-2xl overflow-hidden">
        <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: isLoaded && !isHovered ? 1 : 0,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isHovered && (
            <iframe
              src={`https://www.youtube.com/embed/${product.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${product.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              className={product.isPortrait
                ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[300%]"
                : "w-full h-full"
              }
              style={{ border: 'none', pointerEvents: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
        <motion.div
          className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full p-2"
          animate={{ opacity: isHovered ? 0 : 1 }}
        >
          <Play className="h-4 w-4 text-white fill-white" />
        </motion.div>
        <motion.div
          className="absolute top-4 left-4 bg-sunbeam text-black text-xs font-bold px-3 py-1 rounded-full"
          animate={{ scale: isHovered ? 1.05 : 1 }}
        >
          {product.motion}
        </motion.div>
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-6"
          animate={{ y: isHovered ? -10 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-xs uppercase tracking-wider text-sunbeam mb-2 block">
            {product.category}
          </span>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {product.title}
          </h3>
          <p className="text-white/70 text-sm md:text-base mb-4 max-w-md">
            {product.description}
          </p>
          <motion.div
            className="flex items-center gap-2 text-sunbeam font-medium"
            animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
            transition={{ duration: 0.3 }}
          >
            <span>See it in action</span>
            <ArrowRight className="h-4 w-4" />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 3px rgba(254, 204, 0, 0.8)"
              : "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

function SmallCard({ product, index }: { product: typeof products[0]; index: number }) {
  // All hooks must be called unconditionally at the top
  const [isLoaded, setIsLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-50px" })
  const isMobile = useIsMobile()

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
  }

  // Mobile version - static card
  if (isMobile) {
    return (
      <div
        ref={cardRef}
        className="relative group cursor-pointer lg:flex-1"
      >
        <div className="relative h-[200px] sm:h-[180px] lg:h-full lg:min-h-[240px] rounded-xl overflow-hidden">
          <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />
          <div className="absolute inset-0">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              loading="lazy"
              onLoad={() => setIsLoaded(true)}
              sizes="(max-width: 768px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          <div className="absolute top-3 right-3 bg-black/50 rounded-full p-1.5">
            <Play className="h-3 w-3 text-white fill-white" />
          </div>
          <div className="absolute top-3 left-3 bg-sunbeam text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
            {product.motion}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="text-sm md:text-base font-bold text-white mb-1">
              {product.title}
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-sunbeam">
              {product.category}
            </span>
          </div>
          <div className="absolute inset-0 rounded-xl border border-white/10 pointer-events-none" />
        </div>
      </div>
    )
  }

  // Desktop version with animations
  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer lg:flex-1"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative h-[200px] sm:h-[180px] lg:h-full lg:min-h-[240px] rounded-xl overflow-hidden">
        {/* Loading Placeholder */}
        <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />

        {/* Image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: isLoaded && !isHovered ? 1 : 0,
            scale: isHovered ? 1.08 : 1
          }}
          transition={{
            opacity: { duration: 0.5, ease: "easeOut" },
            scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </motion.div>

        {/* YouTube video on hover */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {isHovered && (
            <iframe
              src={`https://www.youtube.com/embed/${product.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${product.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1`}
              className={product.isPortrait
                ? "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-[300%]"
                : "w-full h-full"
              }
              style={{ border: 'none', pointerEvents: 'none' }}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          )}
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* Play indicator */}
        <motion.div
          className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full p-1.5"
          animate={{ opacity: isHovered ? 0 : 1 }}
        >
          <Play className="h-3 w-3 text-white fill-white" />
        </motion.div>

        {/* Motion type badge */}
        <div className="absolute top-3 left-3 bg-sunbeam text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
          {product.motion}
        </div>

        {/* Content overlay */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4"
          animate={{ y: isHovered ? -5 : 0 }}
        >
          <h3 className="text-sm md:text-base font-bold text-white mb-1">
            {product.title}
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-sunbeam">
            {product.category}
          </span>
        </motion.div>

        {/* Hover Border */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 2px rgba(254, 204, 0, 0.7), 0 20px 40px rgba(0,0,0,0.3)"
              : "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-black overflow-hidden"
    >
      {/* Animated Background - static on mobile */}
      {isMobile ? (
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 grid-pattern" />
        </div>
      ) : (
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{ y: backgroundY }}
        >
          <div className="absolute inset-0 grid-pattern" />
        </motion.div>
      )}

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sunbeam/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[180px]" />

      {/* Box Grid Pattern - bottom right */}
      <div
        className="absolute -bottom-10 -right-10 w-72 h-72 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          {isMobile ? (
            <>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-sunbeam mb-3 block">
                  Our Products
                </span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                  Motion That{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">
                    Mesmerizes
                  </span>
                </h2>
                <p className="text-white/60 mt-3 max-w-lg">
                  Tap each product to learn more. Every installation is custom-built to your specifications.
                </p>
              </div>
              <div>
                <Link
                  href="#booking"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sunbeam/50 text-white px-5 py-2.5 rounded-full transition-all group"
                >
                  <span className="text-sm font-medium">Request Custom Build</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <>
              <div>
                <motion.span
                  className="text-xs uppercase tracking-[0.2em] text-sunbeam mb-3 block"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  Our Products
                </motion.span>
                <motion.h2
                  className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  Motion That{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">
                    Mesmerizes
                  </span>
                </motion.h2>
                <motion.p
                  className="text-white/60 mt-3 max-w-lg"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Hover over each product to see them in action. Every installation is custom-built to your specifications.
                </motion.p>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <Link
                  href="#booking"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-sunbeam/50 text-white px-5 py-2.5 rounded-full transition-all group"
                >
                  <span className="text-sm font-medium">Request Custom Build</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Magazine-Style Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured Large Card */}
          <FeaturedCard product={products[0]} />

          {/* Right Column - Stacked Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6">
            {products.slice(1).map((product, index) => (
              <SmallCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        {isMobile ? (
          <div className="mt-12 text-center">
            <p className="text-white/50 text-sm mb-4">
              These are just a few examples. We build custom kinetic displays for any space.
            </p>
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 text-sunbeam hover:text-amber transition-colors font-medium"
            >
              <span>Book a demo to see the full range</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-white/50 text-sm mb-4">
              These are just a few examples. We build custom kinetic displays for any space.
            </p>
            <Link
              href="#booking"
              className="inline-flex items-center gap-2 text-sunbeam hover:text-amber transition-colors font-medium"
            >
              <span>Book a demo to see the full range</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

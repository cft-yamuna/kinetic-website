"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Set mounted state for hydration safety
    setHasMounted(true)

    // Ensure we're at the top of the page
    window.scrollTo(0, 0)

    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Use mobile optimizations only after hydration
  const useMobileOptimizations = hasMounted && isMobile

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-black pt-28 md:pt-12"
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-black" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Glowing orbs - smaller and less blur on mobile */}
      <div className="absolute top-1/4 left-1/4 w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-sunbeam/10 rounded-full blur-[80px] md:blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-amber/10 rounded-full blur-[60px] md:blur-[120px]" />

      {/* Animated accent lines - static on mobile */}
      {useMobileOptimizations ? (
        <>
          <div className="absolute top-1/4 left-0 w-1 h-40 bg-gradient-to-b from-transparent via-sunbeam/50 to-transparent rounded-full" />
          <div className="absolute bottom-1/3 right-0 w-1 h-32 bg-gradient-to-t from-transparent via-amber/50 to-transparent rounded-full" />
        </>
      ) : (
        <>
          <motion.div
            className="absolute top-1/4 left-0 w-1 h-40 bg-gradient-to-b from-transparent via-sunbeam to-transparent rounded-full"
            animate={{ height: ["160px", "240px", "160px"], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-1/3 right-0 w-1 h-32 bg-gradient-to-t from-transparent via-amber to-transparent rounded-full"
            animate={{ height: ["128px", "200px", "128px"], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
          />
        </>
      )}

      {/* Main Content */}
      <motion.div
        className="relative z-10 container mx-auto px-4"
        style={useMobileOptimizations ? {} : { opacity, scale }}
      >
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-8 items-center min-h-[80vh]">

          {/* Left Side - Text Content */}
          <div className="text-center lg:text-left order-1">
            {/* Main headline */}
            {useMobileOptimizations ? (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-none tracking-tight">
                <span className="text-white inline-block mobile-fade-in-up mobile-delay-2">
                  SCREENS
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar inline-block mobile-fade-in-up mobile-delay-3">
                  THAT MOVE
                </span>
              </h1>
            ) : (
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-none tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 3.1 }}
              >
                <motion.span
                  className="text-white inline-block"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.2, ease: "easeOut" }}
                >
                  SCREENS
                </motion.span>
                <br />
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar inline-block"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.4, ease: "easeOut" }}
                >
                  THAT MOVE
                </motion.span>
              </motion.h1>
            )}

            {/* Sub-headline */}
            {useMobileOptimizations ? (
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light mobile-fade-in-up mobile-delay-4">
                Rotate. Flip. Captivate.
              </p>
            ) : (
              <motion.p
                className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 3.6, ease: "easeOut" }}
              >
                Rotate. Flip. Captivate.
              </motion.p>
            )}

            {/* Description */}
            {useMobileOptimizations ? (
              <p className="text-base md:text-lg text-white/60 mb-8 max-w-lg mx-auto lg:mx-0 mobile-fade-in mobile-delay-5">
                LED displays powered by precision motors that transform static screens into living, breathing installations.
              </p>
            ) : (
              <motion.p
                className="text-base md:text-lg text-white/60 mb-8 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 3.8, ease: "easeOut" }}
              >
                LED displays powered by precision motors that transform static screens into living, breathing installations.
              </motion.p>
            )}

            {/* CTA Buttons */}
            {useMobileOptimizations ? (
              <div className="flex flex-row items-center justify-center lg:justify-start gap-3 mobile-fade-in-up mobile-delay-6">
                <Link href="#booking">
                  <Button
                    size="sm"
                    className="rounded-full text-sm px-5 h-10 bg-gradient-to-r from-sunbeam to-amber text-black font-bold"
                  >
                    <span className="flex items-center">
                      Book Demo
                      <ArrowRight className="ml-1.5 h-4 w-4" />
                    </span>
                  </Button>
                </Link>
                <Link href="#products">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full text-sm px-5 h-10 bg-white/5 border-white/20 text-white"
                  >
                    <Play className="mr-1.5 h-4 w-4" />
                    Products
                  </Button>
                </Link>
              </div>
            ) : (
              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 4.0, ease: "easeOut" }}
              >
                <Link href="#booking">
                  <Button
                    size="lg"
                    className="rounded-full text-base px-8 h-14 bg-gradient-to-r from-sunbeam to-amber text-black font-bold hover:shadow-[0_0_30px_rgba(255,204,1,0.5)] transition-shadow relative overflow-hidden group"
                  >
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 4.5 }}
                    />
                    <span className="relative flex items-center">
                      Book a Live Demo
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </Link>
                <Link href="#products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="rounded-full text-base px-8 h-14 bg-white/5 backdrop-blur-sm border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  >
                    <Play className="mr-2 h-5 w-5" />
                    See Products
                  </Button>
                </Link>
              </motion.div>
            )}
          </div>

          {/* Right Side - Product Images Showcase */}
          <div className="relative order-2 h-[320px] md:h-[450px] lg:h-[600px]">

            {/* Main featured image - center */}
            {useMobileOptimizations ? (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[320px] lg:w-[380px] z-20 mobile-scale-in mobile-delay-2">
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-sunbeam/20"
                  style={{ transform: 'rotate(-3deg)' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <Image
                    src="/1.png"
                    alt="Rotating LED Panels"
                    width={350}
                    height={260}
                    className="w-full h-auto object-cover max-h-[220px] md:max-h-[440px]"
                    priority
                  />
                  <div className="absolute inset-0 border-2 border-sunbeam/50 rounded-2xl" />
                </div>
              </div>
            ) : (
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[320px] lg:w-[380px] z-20"
                initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 3.0, type: "spring", stiffness: 80, damping: 15 }}
              >
                <motion.div
                  className="relative rounded-2xl overflow-hidden shadow-2xl shadow-sunbeam/20"
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 4 }}
                  whileHover={{ scale: 1.03 }}
                  style={{ rotate: -3 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                  <Image
                    src="/1.png"
                    alt="Rotating LED Panels"
                    width={350}
                    height={260}
                    className="w-full h-auto object-cover max-h-[220px] md:max-h-[440px]"
                    priority
                  />
                  <motion.div
                    className="absolute inset-0 border-2 border-sunbeam/50 rounded-2xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 3.5 }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Top right image */}
            {useMobileOptimizations ? (
              <div
                className="absolute top-4 right-4 md:top-8 md:right-8 w-[145px] md:w-[200px] lg:w-[230px] z-10 mobile-slide-right mobile-delay-3"
                style={{ transform: 'rotate(5deg)' }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/2.png"
                    alt="Flip Display System"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover max-h-[175px] md:max-h-[280px]"
                  />
                  <div className="absolute inset-0 border border-amber/40 rounded-xl" />
                </div>
              </div>
            ) : (
              <motion.div
                className="absolute top-4 right-4 md:top-8 md:right-8 w-[145px] md:w-[200px] lg:w-[230px] z-10"
                initial={{ opacity: 0, x: 100, y: -50, rotate: 15 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 3.3, type: "spring", stiffness: 80, damping: 15 }}
              >
                <motion.div
                  className="relative rounded-xl overflow-hidden shadow-xl"
                  animate={{ y: [0, -10, 0], rotate: [5, 7, 5] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 4.5 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  <Image
                    src="/2.png"
                    alt="Flip Display System"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover max-h-[175px] md:max-h-[280px]"
                  />
                  <motion.div
                    className="absolute inset-0 border border-amber/40 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 3.8 }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Bottom left image */}
            {useMobileOptimizations ? (
              <div
                className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-[130px] md:w-[180px] lg:w-[215px] z-10 mobile-slide-left mobile-delay-4"
                style={{ transform: 'rotate(-8deg)' }}
              >
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <Image
                    src="/3.png"
                    alt="Wave Motion Wall"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover max-h-[155px] md:max-h-[320px]"
                  />
                  <div className="absolute inset-0 border border-solar/40 rounded-xl" />
                </div>
              </div>
            ) : (
              <motion.div
                className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-[130px] md:w-[180px] lg:w-[215px] z-10"
                initial={{ opacity: 0, x: -100, y: 50, rotate: -15 }}
                animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                transition={{ duration: 1, delay: 3.5, type: "spring", stiffness: 80, damping: 15 }}
              >
                <motion.div
                  className="relative rounded-xl overflow-hidden shadow-xl"
                  animate={{ y: [0, 12, 0], rotate: [-8, -5, -8] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 5 }}
                  whileHover={{ scale: 1.05, rotate: 0 }}
                >
                  <Image
                    src="/3.png"
                    alt="Wave Motion Wall"
                    width={200}
                    height={150}
                    className="w-full h-auto object-cover max-h-[155px] md:max-h-[320px]"
                  />
                  <motion.div
                    className="absolute inset-0 border border-solar/40 rounded-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 4 }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Decorative floating elements - desktop only */}
            {!useMobileOptimizations && (
              <>
                <motion.div
                  className="absolute top-1/4 left-1/4 w-3 h-3 bg-sunbeam rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.5, 1],
                    y: [0, -20, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: 4.2 }}
                />
                <motion.div
                  className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-amber rounded-full"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.5, 1, 0.5],
                    scale: [1, 1.3, 1],
                    y: [0, 15, 0]
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 4.4 }}
                />
                <motion.div
                  className="absolute top-1/2 right-[15%] w-4 h-4 bg-solar/50 rounded-full blur-sm"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.3, 0.7, 0.3],
                    x: [0, 10, 0]
                  }}
                  transition={{ duration: 4, repeat: Infinity, delay: 4.6 }}
                />

                {/* Connecting lines - desktop only */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ overflow: 'visible' }}>
                  <motion.line
                    x1="30%"
                    y1="70%"
                    x2="45%"
                    y2="55%"
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 4.0 }}
                  />
                  <motion.line
                    x1="70%"
                    y1="20%"
                    x2="55%"
                    y2="40%"
                    stroke="url(#lineGradient)"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 1.5, delay: 4.2 }}
                  />
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#FFCC01" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FFCC01" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#FFCC01" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator - hidden on mobile for cleaner look */}
      {/* {!useMobileOptimizations && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.5, duration: 0.6 }}
        >
          <motion.div
            className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center pt-2"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 5 }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-sunbeam rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: 5 }}
            />
          </motion.div>
        </motion.div>
      )} */}
    </section>
  )
}

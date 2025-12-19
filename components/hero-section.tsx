"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 grid-pattern opacity-100" />

      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
          poster="/kinetic-products-abstract.jpg"
        >
          <source src="/kinetic-products-motion.jpg" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <motion.div className="relative z-10 container mx-auto px-4 text-center" style={{ opacity, scale }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-balance leading-tight text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            We Don't Build Displays,
            <br />
            <span className="text-amber">We Create Living Experiences</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-white/80 mb-12 max-w-2xl mx-auto text-balance"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Kinetic installations, holograms, and immersive displays that transform spaces into unforgettable stories.
            Engineering emotion, crafting wonder.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <Link href="#booking">
              <Button size="lg" className="rounded-full text-base px-8 h-14 bg-sunbeam text-black hover:bg-amber">
                Book a Visit
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full text-base px-8 h-14 bg-transparent border-sunbeam text-sunbeam hover:bg-sunbeam hover:text-black"
              asChild
            >
              <a href="https://www.craftech360.com/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Visit Website
              </a>
            </Button>
          </motion.div>
        </motion.div>

      </motion.div>
    </section>
  )
}

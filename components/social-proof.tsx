"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { value: "50+", label: "Installations", suffix: "" },
  { value: "12", label: "Countries", suffix: "" },
  { value: "3M+", label: "Viewers Captivated", suffix: "" },
  { value: "100", label: "Client Satisfaction", suffix: "%" },
]

const clients = [
  "Dell",
  "PhonePe",
  "Salesforce",
  "LLE",
  "Tata Motors",
  "LAM",
  "KPMG",
  "OnePlus",
  "Toyota",
  "SBER"
]

function AnimatedCounter({ value, suffix }: { value: string; suffix: string }) {
  return (
    <span className="tabular-nums">
      {value}{suffix}
    </span>
  )
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Use mobile optimizations only after hydration to avoid mismatch
  const useMobileOptimizations = hasMounted && isMobile

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 bg-gradient-to-b from-black via-neutral-950 to-black overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
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

      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-sunbeam/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
          {stats.map((stat, index) => (
            useMobileOptimizations ? (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar mb-2">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-sm md:text-base text-white/60 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ) : (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.div
                  className="text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar mb-2"
                  initial={{ scale: 0.5 }}
                  animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: "spring" }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                <p className="text-sm md:text-base text-white/60 uppercase tracking-wider">
                  {stat.label}
                </p>
              </motion.div>
            )
          ))}
        </div>

        {/* Trusted By Marquee */}
        <div className="relative">
          <p className="text-center text-xs uppercase tracking-[0.2em] text-white/40 mb-6">
            Trusted by industry leaders
          </p>

          <div className="relative overflow-hidden">
            {/* Gradient masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />

            {/* Scrolling content - CSS animation on mobile */}
            {useMobileOptimizations ? (
              <div
                className="flex gap-12 whitespace-nowrap animate-marquee"
                style={{
                  animation: 'marquee 15s linear infinite',
                }}
              >
                {[...clients, ...clients, ...clients].map((client, index) => (
                  <span
                    key={index}
                    className="text-lg md:text-xl font-medium text-white/30"
                  >
                    {client}
                  </span>
                ))}
              </div>
            ) : (
              <motion.div
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: [0, -50 * clients.length] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                {[...clients, ...clients, ...clients].map((client, index) => (
                  <span
                    key={index}
                    className="text-lg md:text-xl font-medium text-white/30 hover:text-white/60 transition-colors"
                  >
                    {client}
                  </span>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Testimonial/Quote */}
        {useMobileOptimizations ? (
          <div className="mt-16 text-center max-w-3xl mx-auto">
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 italic leading-relaxed">
              "The moment people see screens move, they stop. They stare. They remember."
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-px bg-sunbeam/50" />
              <span className="text-sm text-sunbeam font-medium">That's the Kinetic Effect</span>
              <div className="w-10 h-px bg-sunbeam/50" />
            </div>
          </div>
        ) : (
          <motion.div
            className="mt-16 text-center max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <blockquote className="text-xl md:text-2xl lg:text-3xl font-light text-white/80 italic leading-relaxed">
              "The moment people see screens move, they stop. They stare. They remember."
            </blockquote>
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="w-10 h-px bg-sunbeam/50" />
              <span className="text-sm text-sunbeam font-medium">That's the Kinetic Effect</span>
              <div className="w-10 h-px bg-sunbeam/50" />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}

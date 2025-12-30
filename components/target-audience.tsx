"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const expectations = [
  "Live product demonstrations",
  "1-on-1 expert consultation",
  "Custom solution discussion",
  "No obligations - zero pressure"
]

export default function TargetAudience() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" })

  return (
    <section
      ref={sectionRef}
      className="relative py-0 overflow-hidden bg-black"
    >
      {/* Full-width cinematic layout */}
      <div className="grid lg:grid-cols-2 min-h-[700px] lg:min-h-[800px]">

        {/* Left - Visual Side with checkered pattern */}
        <motion.div
          className="relative bg-neutral-900 order-2 lg:order-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Background pattern - checkered */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #E17924 25%, transparent 25%),
                  linear-gradient(-45deg, #E17924 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #E17924 75%),
                  linear-gradient(-45deg, transparent 75%, #E17924 75%)
                `,
                backgroundSize: '60px 60px',
                backgroundPosition: '0 0, 0 30px, 30px -30px, -30px 0px'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50" />
          </div>

          {/* Floating elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute top-1/4 left-1/4 w-32 h-32 border border-sunbeam/30 rounded-2xl"
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-sunbeam/20 rounded-xl"
              animate={{ rotate: [360, 270, 180, 90, 0] }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/2 w-40 h-40 bg-sunbeam/5 rounded-full blur-2xl"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
          </div>

          {/* Center content */}
          <div className="relative h-full flex items-center justify-center p-8 lg:p-12">
            <div className="text-center">
              <motion.div
                className="inline-block"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Large number display */}
                <div className="relative">
                  <span className="text-[120px] md:text-[180px] font-black text-transparent bg-clip-text bg-gradient-to-b from-sunbeam via-amber to-sunbeam/30 leading-none">
                    6+
                  </span>
                  <div className="absolute -bottom-2 left-0 right-0 text-center">
                    <span className="text-white/60 text-sm md:text-base tracking-widest uppercase">
                      Products on Display
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Mini stats */}
              <div className="flex justify-center gap-8 mt-12">
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">50+</div>
                  <div className="text-white/40 text-xs uppercase tracking-wider">Installations</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-white">1hr</div>
                  <div className="text-white/40 text-xs uppercase tracking-wider">Personal Demo</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right - Content Side */}
        <motion.div
          className="relative flex items-center order-1 lg:order-2"
          initial={{ opacity: 0, x: 30 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {/* Background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-sunbeam/5 via-transparent to-transparent" />
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-sunbeam/50 via-sunbeam/20 to-transparent" />
          <div className="absolute top-0 left-0 w-px h-full bg-gradient-to-b from-sunbeam/50 via-sunbeam/10 to-transparent hidden lg:block" />

          <div className="relative px-6 py-16 md:px-12 lg:px-16 lg:py-0 w-full">
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <span className="w-12 h-px bg-sunbeam" />
              <span className="text-sunbeam text-xs font-bold tracking-[0.25em] uppercase">
                Showroom Experience
              </span>
            </motion.div>

            {/* Headline */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-[1.1]">
              See It.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam to-amber">
                Believe It.
              </span>
            </h2>

            {/* Description */}
            <p className="text-white/50 text-lg md:text-xl mb-8 max-w-lg leading-relaxed">
              Videos can't capture the magic. Visit our Bengaluru showroom and watch screens rotate, flip, and transform right before your eyes.
            </p>

            {/* What to Expect - Simple bullet points */}
            <ul className="space-y-3 mb-10">
              {expectations.map((item, index) => (
                <motion.li
                  key={item}
                  className="flex items-center gap-3 text-white/70"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.08 }}
                >
                  <span className="w-1.5 h-1.5 bg-sunbeam rounded-full flex-shrink-0" />
                  <span className="text-base">{item}</span>
                </motion.li>
              ))}
            </ul>

            {/* CTA */}
            <Link href="#booking">
              <motion.button
                className="group relative inline-flex items-center gap-2 bg-sunbeam hover:bg-amber text-black font-semibold text-sm md:text-base px-5 py-2.5 md:px-6 md:py-3 rounded-full transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>Book Your Visit</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </Link>

            {/* Location hint */}
            <p className="text-white/30 text-sm mt-6">
              Bengaluru, India  •  Limited slots available
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  )
}

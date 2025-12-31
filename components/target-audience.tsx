"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

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
      {/* Full-width cinematic layout - reduced height */}
      <div className="grid lg:grid-cols-2 min-h-[500px] lg:min-h-[600px]">

        {/* Left - Visual Side with creative background */}
        <motion.div
          className="relative bg-neutral-950 order-2 lg:order-1 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Creative background elements */}
          {/* Ambient glow spots */}
          <div className="absolute top-1/4 -left-20 w-[300px] h-[300px] bg-sunbeam/8 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-0 w-[250px] h-[250px] bg-amber/6 rounded-full blur-[80px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] bg-orange-500/5 rounded-full blur-[120px]" />

          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          />

          {/* Diagonal lines accent */}
          <div
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `repeating-linear-gradient(
                45deg,
                transparent,
                transparent 40px,
                rgba(255,255,255,0.1) 40px,
                rgba(255,255,255,0.1) 41px
              )`
            }}
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/60 via-transparent to-black/40" />

          {/* Content - compact layout */}
          <div className="relative h-full flex flex-col p-4 lg:p-6">
            {/* Top section - 6+ stats - more compact */}
            <div className="text-center pt-2 lg:pt-4">
              <motion.div
                className="inline-block"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                {/* Large number display - slightly smaller */}
                <div className="relative">
                  <span className="text-[80px] md:text-[100px] lg:text-[120px] font-black text-transparent bg-clip-text bg-gradient-to-b from-sunbeam via-amber to-sunbeam/30 leading-none">
                    6+
                  </span>
                  <div className="absolute -bottom-1 left-0 right-0 text-center">
                    <span className="text-white/60 text-[10px] md:text-xs tracking-widest uppercase">
                      Products on Display
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Mini stats - compact */}
              <div className="flex justify-center gap-4 md:gap-6 mt-4">
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-white">50+</div>
                  <div className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-wider">Events Done</div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-center">
                  <div className="text-lg md:text-xl font-bold text-white">1hr</div>
                  <div className="text-white/40 text-[9px] md:text-[10px] uppercase tracking-wider">Personal Demo</div>
                </div>
              </div>
            </div>

            {/* Image Gallery - Staggered wave pattern - fills remaining space */}
            <motion.div
              className="flex-1 mt-4 lg:mt-6 relative flex items-end"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {/* Desktop: Staggered wave pattern - 6 images - larger sizes */}
              <div className="hidden md:flex items-end justify-center gap-3 w-full pb-4">
                {/* Image 1 - tall */}
                <motion.div
                  className="relative w-[140px] lg:w-[170px] h-[210px] lg:h-[260px] rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image src="/images/1.jpg" alt="Showroom 1" fill className="object-cover" sizes="170px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>

                {/* Image 2 - medium, higher */}
                <motion.div
                  className="relative w-[130px] lg:w-[155px] h-[175px] lg:h-[210px] rounded-xl overflow-hidden mb-[45px] lg:mb-[55px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image src="/images/2.jpg" alt="Showroom 2" fill className="object-cover" sizes="155px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 3 - smaller, mid position */}
                <motion.div
                  className="relative w-[120px] lg:w-[145px] h-[155px] lg:h-[180px] rounded-xl overflow-hidden mb-[22px] lg:mb-[28px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image src="/images/3.jpg" alt="Showroom 3" fill className="object-cover" sizes="145px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 4 - medium, highest */}
                <motion.div
                  className="relative w-[130px] lg:w-[155px] h-[165px] lg:h-[200px] rounded-xl overflow-hidden mb-[55px] lg:mb-[68px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image src="/images/4.jpg" alt="Showroom 4" fill className="object-cover" sizes="155px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 5 - small, lower */}
                <motion.div
                  className="relative w-[110px] lg:w-[135px] h-[145px] lg:h-[170px] rounded-xl overflow-hidden mb-[5px]"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image src="/images/5.jpg" alt="Showroom 5" fill className="object-cover" sizes="135px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 6 - tall */}
                <motion.div
                  className="relative w-[140px] lg:w-[170px] h-[200px] lg:h-[240px] rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                  whileHover={{ scale: 1.03 }}
                >
                  <Image src="/images/6.jpg" alt="Showroom 6" fill className="object-cover" sizes="170px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </motion.div>
              </div>

              {/* Mobile: 4 images in staggered row - larger */}
              <div className="md:hidden flex items-end justify-center gap-2 w-full pb-3">
                {/* Image 1 */}
                <motion.div
                  className="relative w-[95px] h-[150px] rounded-lg overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                >
                  <Image src="/images/1.jpg" alt="Showroom 1" fill className="object-cover" sizes="95px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 2 - higher */}
                <motion.div
                  className="relative w-[88px] h-[125px] rounded-lg overflow-hidden mb-[32px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                >
                  <Image src="/images/2.jpg" alt="Showroom 2" fill className="object-cover" sizes="88px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 3 - highest */}
                <motion.div
                  className="relative w-[88px] h-[120px] rounded-lg overflow-hidden mb-[45px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                >
                  <Image src="/images/3.jpg" alt="Showroom 3" fill className="object-cover" sizes="88px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>

                {/* Image 4 */}
                <motion.div
                  className="relative w-[95px] h-[140px] rounded-lg overflow-hidden mb-[14px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                >
                  <Image src="/images/4.jpg" alt="Showroom 4" fill className="object-cover" sizes="95px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </motion.div>
              </div>
            </motion.div>
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

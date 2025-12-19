"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Sparkles, Calendar } from "lucide-react"
import Link from "next/link"

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    // Set end date to 1 month from now
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + 1)

    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = endDate.getTime() - now.getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-sunbeam via-amber to-solar"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 md:gap-6 py-2.5 md:py-3 text-black relative">
            {/* Sparkle icon */}
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
            </motion.div>

            {/* Main text */}
            <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center">
              <span className="text-xs md:text-sm font-bold uppercase tracking-wide">
                Limited Time Offer
              </span>
              <span className="hidden md:block">|</span>
              <span className="text-xs md:text-sm font-medium">
                Book your exclusive visit to see our products live
              </span>
            </div>

            {/* Countdown */}
            <div className="hidden lg:flex items-center gap-1 bg-black/10 rounded-full px-3 py-1">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs font-mono font-bold">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
              </span>
            </div>

            {/* CTA Button */}
            <Link href="#booking">
              <motion.button
                className="bg-black text-white text-xs md:text-sm font-semibold px-3 md:px-4 py-1.5 rounded-full hover:bg-black/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Book Now
              </motion.button>
            </Link>

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 md:right-4 p-1 hover:bg-black/10 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

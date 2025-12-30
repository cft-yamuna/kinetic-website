"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Zap, Clock } from "lucide-react"
import Link from "next/link"

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

export default function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true)
  const isMobile = useIsMobile()

  if (!isVisible) return null

  // Mobile version - minimal animations
  if (isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-sunbeam/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 py-2.5 text-white relative">
            {/* Pulsing indicator - CSS only */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-red-400">
                LIVE
              </span>
            </div>

            {/* Urgency text */}
            <span className="text-xs font-medium">
              <span className="text-sunbeam font-bold">Limited slots</span> per day
            </span>

   

            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4 text-white/60" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Desktop version with animations
  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-sunbeam/30"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-3 md:gap-6 py-2.5 md:py-3 text-white relative">
            {/* Pulsing indicator */}
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wide text-red-400">
                LIVE
              </span>
            </motion.div>

            {/* Urgency text */}
            <div className="flex items-center gap-2 md:gap-3">
              <span className="text-xs md:text-sm font-medium">
                <span className="text-sunbeam font-bold">Limited slots</span> per day — Book your demo now
              </span>
            </div>


            {/* Close button */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 md:right-4 p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close banner"
            >
              <X className="h-4 w-4 text-white/60" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles } from "lucide-react"
import Link from "next/link"

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isBookingSectionVisible, setIsBookingSectionVisible] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    const handleScroll = () => {
      // Only show if scrolled past 500px AND booking section is not visible
      setIsVisible(window.scrollY > 500 && !isBookingSectionVisible)
    }

    // Observe booking section visibility
    const bookingSection = document.getElementById("booking")
    let observer: IntersectionObserver | null = null

    if (bookingSection) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsBookingSectionVisible(entry.isIntersecting)
          })
        },
        { threshold: 0.2 } // Trigger when 20% of section is visible
      )
      observer.observe(bookingSection)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("scroll", handleScroll)
      if (observer && bookingSection) {
        observer.unobserve(bookingSection)
      }
    }
  }, [isBookingSectionVisible])

  // Hide button when booking section is visible
  const showButton = isVisible && !isBookingSectionVisible

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Link href="#booking">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Star tail particles */}
              <motion.div
                className="absolute -left-3 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.span
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-sunbeam rounded-full"
                    style={{
                      left: `${-i * 8}px`,
                      top: `${Math.sin(i * 0.8) * 6}px`,
                    }}
                    animate={{
                      opacity: [0.8, 0.2, 0.8],
                      scale: [1, 0.6, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </motion.div>

              {/* Orbiting sparkles */}
              <motion.div
                className="absolute inset-0"
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <motion.span
                  className="absolute -top-2 left-1/2 w-2 h-2 bg-amber rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.span
                  className="absolute -bottom-2 left-1/2 w-1.5 h-1.5 bg-solar rounded-full"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.4, 0.8] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>

              {/* Shooting star trails */}
              <motion.div
                className="absolute -left-8 -top-4"
                animate={{
                  x: [0, 60],
                  y: [0, 40],
                  opacity: [0, 1, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <div className="w-8 h-0.5 bg-gradient-to-r from-transparent via-sunbeam to-white rotate-45 rounded-full" />
              </motion.div>

              {/* Glowing background */}
              <motion.div
                className="absolute inset-0 rounded-full bg-sunbeam/40 blur-xl"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Main button */}
              <motion.button
                className="relative flex items-center gap-2 bg-gradient-to-r from-sunbeam via-amber to-solar text-black font-bold px-5 py-3.5 rounded-full shadow-2xl"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(255, 193, 7, 0.4)",
                    "0 0 40px rgba(255, 193, 7, 0.6)",
                    "0 0 20px rgba(255, 193, 7, 0.4)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Inner sparkle effect */}
                <motion.span
                  className="absolute inset-0 rounded-full overflow-hidden"
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                </motion.span>

                <motion.div
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
                <span className={isMobile ? "sr-only" : "relative"}>Book Now</span>

                {/* Star burst on text */}
                <motion.span
                  className="absolute right-3 top-1 w-1 h-1 bg-white rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                />
              </motion.button>

              {/* Corner sparkles */}
              <motion.span
                className="absolute -top-1 -right-1 text-amber"
                animate={{
                  scale: [1, 1.4, 1],
                  rotate: [0, 180, 360],
                  opacity: [1, 0.6, 1]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✦
              </motion.span>
              <motion.span
                className="absolute -bottom-1 -left-1 text-solar text-xs"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.8, 0.4, 0.8]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                ✦
              </motion.span>
            </motion.div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

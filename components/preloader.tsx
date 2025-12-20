"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [showReveal, setShowReveal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    // Set mounted state for hydration safety
    setHasMounted(true)

    // Disable browser scroll restoration and scroll to top
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)

    // Check if mobile
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()

    // Simulate loading progress - faster on mobile
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        // Faster progress on mobile
        const baseIncrement = isMobile ? 5 : 3
        const increment = prev < 70 ? baseIncrement : prev < 90 ? baseIncrement - 1 : 1
        return Math.min(prev + increment, 100)
      })
    }, 50)

    // Start reveal animation - slightly faster on mobile
    const revealTimer = setTimeout(() => {
      setShowReveal(true)
    }, isMobile ? 1800 : 2200)

    // Complete loading - faster on mobile
    const loadTimer = setTimeout(() => {
      setIsLoading(false)
    }, isMobile ? 2400 : 2800)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(revealTimer)
      clearTimeout(loadTimer)
    }
  }, [isMobile])

  // Use mobile optimizations only after hydration
  const useMobileOptimizations = hasMounted && isMobile

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {/* Background grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                  linear-gradient(to right, white 1px, transparent 1px),
                  linear-gradient(to bottom, white 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }}
            />
          </div>

          {/* Glowing orbs - static on mobile for performance */}
          {useMobileOptimizations ? (
            <>
              <div className="absolute top-1/3 left-1/3 w-[200px] h-[200px] bg-sunbeam/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-1/3 right-1/3 w-[150px] h-[150px] bg-amber/20 rounded-full blur-[60px]" />
            </>
          ) : (
            <>
              <motion.div
                className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-sunbeam/20 rounded-full blur-[100px]"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute bottom-1/3 right-1/3 w-[200px] h-[200px] bg-amber/20 rounded-full blur-[80px]"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.15, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
            </>
          )}

          {/* Main content container */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo/Brand */}
            {useMobileOptimizations ? (
              <div className="mb-8 mobile-fade-in-up mobile-delay-1">
                <Image
                  src="/images/logowhite.png"
                  alt="Craftech 360"
                  width={200}
                  height={60}
                  className="h-12 md:h-16 w-auto"
                  priority
                />
              </div>
            ) : (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Image
                  src="/images/logowhite.png"
                  alt="Craftech 360"
                  width={200}
                  height={60}
                  className="h-12 md:h-16 w-auto"
                  priority
                />
              </motion.div>
            )}

            {/* Animated text */}
            {useMobileOptimizations ? (
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-1 mb-2 mobile-fade-in mobile-delay-2">
                  <span className="text-2xl font-black text-white">SCREENS THAT</span>
                </div>
                <div className="flex items-center justify-center gap-1 mobile-fade-in-up mobile-delay-3">
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">
                    MOVE
                  </span>
                </div>
              </div>
            ) : (
              <motion.div
                className="text-center mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <motion.div className="flex items-center justify-center gap-1 mb-2">
                  {["S", "C", "R", "E", "E", "N", "S"].map((letter, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl md:text-3xl font-black text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                  <motion.span
                    className="text-2xl md:text-3xl font-black text-white mx-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    {" "}
                  </motion.span>
                  {["T", "H", "A", "T"].map((letter, i) => (
                    <motion.span
                      key={i}
                      className="text-2xl md:text-3xl font-black text-white"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 + i * 0.05 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
                <motion.div className="flex items-center justify-center gap-1">
                  {["M", "O", "V", "E"].map((letter, i) => (
                    <motion.span
                      key={i}
                      className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar"
                      initial={{ opacity: 0, y: 20, scale: 0.5 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 1.1 + i * 0.08, type: "spring", stiffness: 200 }}
                    >
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Progress bar */}
            {useMobileOptimizations ? (
              <div className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden mobile-fade-in mobile-delay-3">
                <div
                  className="h-full bg-gradient-to-r from-sunbeam via-amber to-solar rounded-full transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : (
              <motion.div
                className="w-48 md:w-64 h-1 bg-white/10 rounded-full overflow-hidden"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-sunbeam via-amber to-solar rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </motion.div>
            )}

            {/* Progress text */}
            {useMobileOptimizations ? (
              <p className="mt-4 text-xs text-white/50 font-mono mobile-fade-in mobile-delay-4">
                {progress}%
              </p>
            ) : (
              <motion.p
                className="mt-4 text-xs text-white/50 font-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                {progress}%
              </motion.p>
            )}

            {/* Loading dots - CSS animation on mobile */}
            {useMobileOptimizations ? (
              <div className="flex gap-1 mt-6 mobile-fade-in mobile-delay-4">
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-sunbeam rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            ) : (
              <motion.div
                className="flex gap-1 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {[0, 1, 2].map(i => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 bg-sunbeam rounded-full"
                    animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* Reveal curtains */}
          <AnimatePresence>
            {showReveal && (
              <>
                {/* Top curtain */}
                <motion.div
                  className="absolute top-0 left-0 right-0 h-1/2 bg-black z-20"
                  initial={{ y: 0 }}
                  animate={{ y: "-100%" }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                />
                {/* Bottom curtain */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-1/2 bg-black z-20"
                  initial={{ y: 0 }}
                  animate={{ y: "100%" }}
                  transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
                />
              </>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

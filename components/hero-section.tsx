"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// CSS styles for mobile box animation - optimized for performance
// Initial rotations for staggered look (like desktop)
// Box 1: 25deg, Box 2: -30deg, Box 3: 35deg, Box 4: -25deg, Box 5: 30deg, Box 6: -35deg
// When flipped: all go to 180deg (linear/aligned) showing back face
// When returned: back to staggered positions
const mobileBoxStyles = `
  /* Initial load animation - flip from staggered to 180 (linear) and back to staggered */
  @keyframes initialFlip1 {
    0% { transform: rotateY(25deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(25deg); }
  }
  @keyframes initialFlip2 {
    0% { transform: rotateY(-30deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(-30deg); }
  }
  @keyframes initialFlip3 {
    0% { transform: rotateY(35deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(35deg); }
  }
  @keyframes initialFlip4 {
    0% { transform: rotateY(-25deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(-25deg); }
  }
  @keyframes initialFlip5 {
    0% { transform: rotateY(30deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(30deg); }
  }
  @keyframes initialFlip6 {
    0% { transform: rotateY(-35deg); }
    50% { transform: rotateY(180deg); }
    100% { transform: rotateY(-35deg); }
  }

  /* Flip to linear (180deg) - all boxes align when showing back */
  @keyframes flipToLinear1 {
    0% { transform: rotateY(25deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes flipToLinear2 {
    0% { transform: rotateY(-30deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes flipToLinear3 {
    0% { transform: rotateY(35deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes flipToLinear4 {
    0% { transform: rotateY(-25deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes flipToLinear5 {
    0% { transform: rotateY(30deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes flipToLinear6 {
    0% { transform: rotateY(-35deg); }
    100% { transform: rotateY(180deg); }
  }

  /* Return from linear (180deg) back to staggered positions */
  @keyframes returnToStaggered1 {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(25deg); }
  }
  @keyframes returnToStaggered2 {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(-30deg); }
  }
  @keyframes returnToStaggered3 {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(35deg); }
  }
  @keyframes returnToStaggered4 {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(-25deg); }
  }
  @keyframes returnToStaggered5 {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(30deg); }
  }
  @keyframes returnToStaggered6 {
    0% { transform: rotateY(180deg); }
    100% { transform: rotateY(-35deg); }
  }

  .mobile-box {
    transform-style: preserve-3d;
    will-change: transform;
    -webkit-transform-style: preserve-3d;
  }

  /* Initial rotation positions (staggered like desktop) - only applied when idle */
  .mobile-box-1:not(.initial-flip):not(.flip-to-linear):not(.return-to-staggered) { transform: rotateY(25deg); }
  .mobile-box-2:not(.initial-flip):not(.flip-to-linear):not(.return-to-staggered) { transform: rotateY(-30deg); }
  .mobile-box-3:not(.initial-flip):not(.flip-to-linear):not(.return-to-staggered) { transform: rotateY(35deg); }
  .mobile-box-4:not(.initial-flip):not(.flip-to-linear):not(.return-to-staggered) { transform: rotateY(-25deg); }
  .mobile-box-5:not(.initial-flip):not(.flip-to-linear):not(.return-to-staggered) { transform: rotateY(30deg); }
  .mobile-box-6:not(.initial-flip):not(.flip-to-linear):not(.return-to-staggered) { transform: rotateY(-35deg); }

  /* Initial flip animations - staggered to linear and back */
  .mobile-box-1.initial-flip { animation: initialFlip1 3.5s ease-in-out forwards; }
  .mobile-box-2.initial-flip { animation: initialFlip2 3.5s ease-in-out forwards; animation-delay: 0.15s; }
  .mobile-box-3.initial-flip { animation: initialFlip3 3.5s ease-in-out forwards; animation-delay: 0.3s; }
  .mobile-box-4.initial-flip { animation: initialFlip4 3.5s ease-in-out forwards; animation-delay: 0.45s; }
  .mobile-box-5.initial-flip { animation: initialFlip5 3.5s ease-in-out forwards; animation-delay: 0.6s; }
  .mobile-box-6.initial-flip { animation: initialFlip6 3.5s ease-in-out forwards; animation-delay: 0.75s; }

  /* Flip to linear (swipe triggers this) */
  .mobile-box-1.flip-to-linear { animation: flipToLinear1 2.5s ease-in-out forwards; }
  .mobile-box-2.flip-to-linear { animation: flipToLinear2 2.5s ease-in-out forwards; }
  .mobile-box-3.flip-to-linear { animation: flipToLinear3 2.5s ease-in-out forwards; }
  .mobile-box-4.flip-to-linear { animation: flipToLinear4 2.5s ease-in-out forwards; }
  .mobile-box-5.flip-to-linear { animation: flipToLinear5 2.5s ease-in-out forwards; }
  .mobile-box-6.flip-to-linear { animation: flipToLinear6 2.5s ease-in-out forwards; }

  /* Return to staggered positions */
  .mobile-box-1.return-to-staggered { animation: returnToStaggered1 2.5s ease-in-out forwards; }
  .mobile-box-2.return-to-staggered { animation: returnToStaggered2 2.5s ease-in-out forwards; }
  .mobile-box-3.return-to-staggered { animation: returnToStaggered3 2.5s ease-in-out forwards; }
  .mobile-box-4.return-to-staggered { animation: returnToStaggered4 2.5s ease-in-out forwards; }
  .mobile-box-5.return-to-staggered { animation: returnToStaggered5 2.5s ease-in-out forwards; }
  .mobile-box-6.return-to-staggered { animation: returnToStaggered6 2.5s ease-in-out forwards; }

  .mobile-box-face {
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    will-change: transform;
  }
  .mobile-box-back {
    transform: rotateY(180deg) translateZ(0);
  }
  .mobile-3d-edge {
    will-change: transform;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  /* Mobile text animations - pure CSS for smooth performance */
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  .mobile-text-animate {
    opacity: 0;
    animation: fadeInUp 0.6s ease-out forwards;
  }
  .mobile-text-delay-1 { animation-delay: 0.5s; }
  .mobile-text-delay-2 { animation-delay: 0.8s; }
  .mobile-text-delay-3 { animation-delay: 1.1s; }
  .mobile-text-delay-4 { animation-delay: 1.4s; }
  .mobile-text-delay-5 { animation-delay: 1.7s; }
`

// Typing Animation Component
function TypingText({
  text,
  delay = 0,
  speed = 50,
  className = "",
  onComplete
}: {
  text: string
  delay?: number
  speed?: number
  className?: string
  onComplete?: () => void
}) {
  const [displayedText, setDisplayedText] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setHasStarted(true)
      setIsTyping(true)
    }, delay)

    return () => clearTimeout(startTimer)
  }, [delay])

  useEffect(() => {
    if (!hasStarted) return

    if (displayedText.length < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1))
      }, speed)
      return () => clearTimeout(timer)
    } else {
      setIsTyping(false)
      onComplete?.()
    }
  }, [displayedText, text, speed, hasStarted, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {isTyping && <span className="animate-pulse">|</span>}
    </span>
  )
}

// Mobile Box Tower - Pure CSS for performance (no Framer Motion)
function MobileBoxTower() {
  const [animationState, setAnimationState] = useState<'idle' | 'initial-flip' | 'flip-to-linear' | 'return-to-staggered'>('idle')
  const [isFlipped, setIsFlipped] = useState(false) // false = staggered (front), true = linear (back)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const autoReturnTimer = useRef<NodeJS.Timeout | null>(null)

  // 7 boxes: 1 base + 6 rotating (with index for CSS class)
  const boxes = [
    { id: 0, isBase: true, text: '', backText: '', boxIndex: 0 },
    { id: 1, text: 'YOUR VISION', backText: '360°', boxIndex: 1 },
    { id: 2, text: 'CAPTIVATE', backText: 'ROTATE', boxIndex: 2 },
    { id: 3, text: 'FLIP & ROTATE', backText: 'FLIP', boxIndex: 3 },
    { id: 4, text: 'THAT MOVE', backText: 'MOTION', boxIndex: 4 },
    { id: 5, text: 'LED SCREENS', backText: 'LED', boxIndex: 5 },
    { id: 6, text: 'KINETIC', backText: 'KINETIC', boxIndex: 6 },
  ]

  // Preload: Start initial flip animation on mount
  useEffect(() => {
    // Start initial flip animation after a brief delay
    const timer = setTimeout(() => {
      setAnimationState('initial-flip')
    }, 300)
    return () => {
      clearTimeout(timer)
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current)
      }
    }
  }, [])

  // Auto-return to staggered position after showing back for a few seconds
  useEffect(() => {
    if (isFlipped && animationState === 'flip-to-linear') {
      // Clear any existing timer
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current)
      }

      // Set timer to auto-return after 4 seconds (wait for flip animation to complete + pause)
      autoReturnTimer.current = setTimeout(() => {
        setAnimationState('return-to-staggered')
        setIsFlipped(false)
      }, 4000)
    }

    return () => {
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current)
      }
    }
  }, [isFlipped, animationState])

  // Handle swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    const swipeDistance = touchEndX.current - touchStartX.current
    const minSwipeDistance = 50 // minimum swipe distance to trigger

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      // Clear auto-return timer if user swipes manually
      if (autoReturnTimer.current) {
        clearTimeout(autoReturnTimer.current)
        autoReturnTimer.current = null
      }

      if (isFlipped) {
        // Currently showing back (linear) - return to staggered (front)
        setAnimationState('return-to-staggered')
        setIsFlipped(false)
      } else {
        // Currently showing front (staggered) - flip to linear (back)
        setAnimationState('flip-to-linear')
        setIsFlipped(true)
      }
    }

    // Reset touch positions
    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Get animation class for each box (includes box-specific index class)
  const getAnimationClass = (isBase: boolean, boxIndex: number) => {
    if (isBase) return ''
    // Always include the box index class for initial rotation position
    const indexClass = `mobile-box-${boxIndex}`
    if (animationState === 'idle') return indexClass
    return `${indexClass} ${animationState}`
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
        {/* Simplified glow effect - no blur filter for performance */}
        <div
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[150px] h-[150px] pointer-events-none rounded-full"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(225, 121, 36, 0.3) 0%, transparent 60%)',
            opacity: animationState !== 'idle' ? 0.6 : 0.3,
            transition: 'opacity 0.5s',
          }}
        />

        {/* Box Tower */}
        <div
          className="relative flex flex-col-reverse items-center"
          style={{
            transform: 'translateY(5%) rotateX(5deg)',
            perspective: '800px',
            perspectiveOrigin: 'center center',
            transformStyle: 'preserve-3d',
          }}
        >
          {boxes.map((box, index) => (
            <div
              key={box.id}
              className={`relative mobile-box ${getAnimationClass(box.isBase, box.boxIndex)}`}
              style={{
                marginTop: box.isBase ? 0 : -1,
                zIndex: boxes.length - index,
              }}
            >
              <div
                className={box.isBase ? 'w-[150px] h-[45px]' : 'w-[135px] h-[45px]'}
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 rounded-sm mobile-box-face"
                  style={{
                    transform: 'translateZ(10px)',
                    background: '#0a0a0a',
                    border: '2px solid #E17924',
                    boxShadow: '0 0 10px rgba(225, 121, 36, 0.3)',
                  }}
                >
                  <div
                    className="absolute inset-[2px] rounded-sm overflow-hidden bg-black flex items-center justify-center"
                    style={{ transform: 'none', transition: 'none', animation: 'none' }}
                  >
                    {box.isBase ? (
                      <div className="w-full h-full relative bg-gradient-to-b from-[#2a2a2a] to-black">
                        <div
                          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[2px] bg-[#E17924]"
                          style={{ boxShadow: '0 0 8px rgba(225, 121, 36, 0.6)' }}
                        />
                      </div>
                    ) : (
                      <span
                        className="font-black text-center px-1 text-[#E17924]"
                        style={{
                          fontSize: box.text.length > 10 ? '10px' : '12px',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          transform: 'none',
                          transition: 'none',
                          animation: 'none',
                          textShadow: '0 0 8px rgba(225, 121, 36, 0.5)',
                        }}
                      >
                        {box.text}
                      </span>
                    )}
                  </div>
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 rounded-sm mobile-box-face"
                  style={{
                    transform: 'translateZ(-10px) rotateY(180deg)',
                    background: '#0a0a0a',
                    border: '2px solid #E17924',
                    boxShadow: '0 0 10px rgba(225, 121, 36, 0.3)',
                  }}
                >
                  {!box.isBase && (
                    <div
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ transform: 'none', transition: 'none', animation: 'none' }}
                    >
                      <span
                        className="font-black text-[13px] text-[#E17924]"
                        style={{
                          textShadow: '0 0 8px rgba(225, 121, 36, 0.5)',
                          transform: 'none',
                          transition: 'none',
                          animation: 'none',
                        }}
                      >
                        {box.backText}
                      </span>
                    </div>
                  )}
                </div>

                {/* 3D Left edge */}
                {!box.isBase && (
                  <div
                    className="absolute top-0 bottom-0 mobile-3d-edge"
                    style={{
                      left: 0,
                      width: '20px',
                      transform: 'rotateY(-90deg)',
                      transformOrigin: 'left center',
                      background: 'linear-gradient(to right, #6C2A00, #BA5617)',
                    }}
                  />
                )}

                {/* 3D Right edge */}
                {!box.isBase && (
                  <div
                    className="absolute top-0 bottom-0 mobile-3d-edge"
                    style={{
                      right: 0,
                      width: '20px',
                      transform: 'rotateY(90deg)',
                      transformOrigin: 'right center',
                      background: 'linear-gradient(to left, #6C2A00, #BA5617)',
                    }}
                  />
                )}

                {/* 3D Top edge */}
                {!box.isBase && (
                  <div
                    className="absolute left-0 right-0 mobile-3d-edge"
                    style={{
                      top: 0,
                      height: '20px',
                      transform: 'rotateX(90deg)',
                      transformOrigin: 'top center',
                      background: '#E17924',
                    }}
                  />
                )}

                {/* 3D Bottom edge */}
                {!box.isBase && (
                  <div
                    className="absolute left-0 right-0 mobile-3d-edge"
                    style={{
                      bottom: 0,
                      height: '20px',
                      transform: 'rotateX(-90deg)',
                      transformOrigin: 'bottom center',
                      background: '#994E1F',
                    }}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Swipe instruction */}
        <div
          className="absolute bottom-[2%] left-1/2 -translate-x-1/2 text-white/40 text-xs flex items-center gap-2"
        >
   
        </div>
    </div>
  )
}

// Desktop Rotating Box Tower Component (with Framer Motion)
function RotatingBoxTower({ scrollProgress }: { scrollProgress?: any }) {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverRotations, setHoverRotations] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0])
  const [activeBoxes, setActiveBoxes] = useState<boolean[]>([false, false, false, false, false, false, false, false])
  const [isMobileView, setIsMobileView] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll-based transforms for shrinking boxes into ball
  const boxesScale = useTransform(scrollProgress || new Map(), [0, 0.5, 0.8], [1, 0.6, 0.2])
  const boxesOpacity = useTransform(scrollProgress || new Map(), [0, 0.6, 0.85], [1, 1, 0])
  const ballScale = useTransform(scrollProgress || new Map(), [0.5, 0.7, 0.9], [0, 1, 1.2])
  const ballOpacity = useTransform(scrollProgress || new Map(), [0.5, 0.65, 0.85, 1], [0, 1, 1, 0])
  const ballY = useTransform(scrollProgress || new Map(), [0.7, 1], [0, 300])

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Intersection Observer - auto-start animation when in view (mobile)
  useEffect(() => {
    if (!isMobileView || !containerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isInView) {
            setIsInView(true)
            // Auto-start animation when scrolled into view on mobile
            handleMouseEnter()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [isMobileView, isInView])

  // Brand colors from Frame 58.png only
  const boxColors = [
    '#6C2A00', // base - dark brown
    '#E17924', // bright orange
    '#BA5617', // darker orange
    '#994E1F', // brown-orange
    '#E17924', // bright orange
    '#6C2A00', // dark brown
    '#BA5617', // darker orange
    '#994E1F', // brown-orange
  ]

  // Initial static rotations - smaller on mobile for better readability
  const initialRotations = isMobileView
    ? [
        0,    // base stays fixed
        10,   // box 1 - small rotation
        -12,  // box 2
        15,   // box 3
        -10,  // box 4
        12,   // box 5
      ]
    : [
        0,    // base stays fixed
        35,   // box 1
        -40,  // box 2
        45,   // box 3
        -35,  // box 4
        40,   // box 5
        -45,  // box 6
        38,   // box 7
      ]

  // Interval ref for continuous animation
  const animationInterval = useRef<NodeJS.Timeout | null>(null)

  // Track rotation cycle (0 = 180, 1 = 360/0, etc)
  const [rotationCycle, setRotationCycle] = useState(0)

  // Generate 180 degree rotations (alternating direction for variety)
  // Use consistent small variations to prevent glitchy jumps
  const generate180Rotations = (cycle: number) => {
    const boxCount = isMobileView ? 6 : 8 // fewer boxes on mobile
    const newRotations: number[] = [0] // base stays fixed
    for (let i = 1; i < boxCount; i++) {
      // Alternate between 180 and 0 (or 360), with consistent small variation per box
      const baseRotation = cycle % 2 === 0 ? 180 : 0
      // Use box index for consistent variation pattern instead of pure random
      const variation = ((i * 7) % 11 - 5) // consistent -5 to +5 variation based on index
      newRotations.push(baseRotation + variation)
    }
    return newRotations
  }

  // On hover - rotate 180 degrees, then continue cycling
  const handleMouseEnter = () => {
    const newActiveBoxes: boolean[] = [true, true, true, true, true, true, true, true]
    setActiveBoxes(newActiveBoxes)

    // First rotation - 180 degrees
    const nextCycle = rotationCycle + 1
    setRotationCycle(nextCycle)
    setHoverRotations(generate180Rotations(nextCycle))
    setIsHovered(true)

    // Keep cycling 180 degree rotations while hovering
    // Interval must be >= animation duration to prevent glitching
    animationInterval.current = setInterval(() => {
      setRotationCycle(prev => {
        const next = prev + 1
        setHoverRotations(generate180Rotations(next))
        return next
      })
    }, 4200) // Flip every 4.2s (slightly longer than 4s animation duration)
  }

  const handleMouseLeave = () => {
    // On mobile, don't stop on mouse leave (use click to toggle)
    if (isMobileView) return

    setIsHovered(false)
    // Stop continuous animation
    if (animationInterval.current) {
      clearInterval(animationInterval.current)
      animationInterval.current = null
    }
  }

  // Click handler for mobile - toggle animation
  const handleClick = () => {
    if (!isMobileView) return

    if (isHovered) {
      // Stop animation
      setIsHovered(false)
      if (animationInterval.current) {
        clearInterval(animationInterval.current)
        animationInterval.current = null
      }
    } else {
      // Start animation
      handleMouseEnter()
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationInterval.current) {
        clearInterval(animationInterval.current)
      }
    }
  }, [])

  // All boxes definition (Frame 58 colors only)
  // Using solid black (#000000) for all back faces
  const allBoxes = [
    { id: 0, isBase: true, color: boxColors[0], text: '', backText: '', backColor: '#000000' },
    { id: 1, color: boxColors[1], text: 'YOUR VISION', backText: '360°', backColor: '#000000' },
    { id: 2, color: boxColors[2], text: 'CAPTIVATE', backText: 'ROTATE', backColor: '#000000' },
    { id: 3, color: boxColors[3], text: 'FLIP & ROTATE', backText: 'FLIP', backColor: '#000000' },
    { id: 4, color: boxColors[4], text: 'THAT MOVE', backText: 'MOTION', backColor: '#000000' },
    { id: 5, color: boxColors[5], text: 'LED SCREENS', backText: 'LED', backColor: '#000000' },
    { id: 6, color: boxColors[6], text: 'DYNAMIC', backText: 'POWER', backColor: '#000000' },
    { id: 7, color: boxColors[7], text: 'KINETIC', backText: 'KINETIC', backColor: '#000000' },
  ]

  // Mobile: 1 base + 5 boxes (6 total), Desktop: 1 base + 7 boxes (8 total)
  const boxes = isMobileView ? allBoxes.slice(0, 6) : allBoxes

  return (
    <motion.div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: isMobileView ? 0.5 : 3.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow effect behind the tower - Frame 58 colors */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[250px] md:w-[400px] lg:w-[500px] h-[250px] md:h-[400px] lg:h-[500px] pointer-events-none"
        animate={{
          opacity: isHovered ? 0.7 : 0.4,
        }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(225, 121, 36, 0.5) 0%, rgba(186, 86, 23, 0.25) 30%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Floor reflection/glow - Frame 58 colors */}
      <motion.div
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[200px] md:w-[300px] lg:w-[400px] h-[40px] md:h-[60px] lg:h-[80px]"
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(225, 121, 36, 0.6) 0%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Ball forming from boxes */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 80,
          height: 80,
          background: 'radial-gradient(circle at 30% 30%, #E17924 0%, #BA5617 40%, #6C2A00 100%)',
          boxShadow: '0 0 40px rgba(225, 121, 36, 0.8), 0 0 80px rgba(225, 121, 36, 0.4), inset 0 -10px 20px rgba(0,0,0,0.3)',
          scale: ballScale,
          opacity: ballOpacity,
          y: ballY,
          zIndex: 100,
        }}
      />

      {/* Box Tower */}
      <motion.div
        className="relative flex flex-col-reverse items-center"
        style={{
          transform: isMobileView ? 'translateY(5%) rotateX(3deg)' : 'translateY(8%) rotateX(5deg)',
          perspective: isMobileView ? '800px' : '1200px',
          transformStyle: 'preserve-3d',
          scale: boxesScale,
          opacity: boxesOpacity,
        }}
      >

        {boxes.map((box, index) => (
          <motion.div
            key={box.id}
            className="relative"
            style={{
              marginTop: box.isBase ? 0 : (isMobileView ? -1 : -2),
              zIndex: boxes.length - index,
              transformStyle: 'preserve-3d',
              willChange: 'transform',
            }}
            initial={{
              rotateY: 0,
              opacity: 0,
              y: -150,
              scale: 0.8,
            }}
            animate={{
              // Base box never rotates, others animate on hover
              rotateY: box.isBase ? 0 : (isHovered ? hoverRotations[index] : initialRotations[index]),
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              rotateY: {
                duration: box.isBase ? 0 : (isHovered ? 4 : 2.5), // Base doesn't rotate
                delay: box.isBase ? 0 : (isHovered ? index * 0.1 : 0),
                ease: "easeInOut", // Smooth symmetric easing prevents glitchy snaps
              },
              opacity: {
                duration: 0.8,
                delay: 3.0 + index * 0.15,
                ease: "easeOut"
              },
              y: {
                duration: 1.2,
                delay: 3.0 + index * 0.15,
                ease: [0.22, 1, 0.36, 1]
              },
              scale: {
                duration: 0.8,
                delay: 3.0 + index * 0.15,
                ease: "easeOut"
              },
            }}
          >
            {/* Box - Clean 3D LED Screen */}
            <div
              className={`
                relative
                ${box.isBase
                  ? 'w-[150px] h-[40px] md:w-[220px] md:h-[60px] lg:w-[280px] lg:h-[70px]'
                  : 'w-[130px] h-[40px] md:w-[200px] md:h-[60px] lg:w-[250px] lg:h-[70px]'
                }
              `}
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Front face - Screen */}
              <div
                className="absolute inset-0 rounded-sm"
                style={{
                  transform: 'translateZ(10px)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: '#000000',
                  outline: '2px solid #E17924',
                  outlineOffset: '-2px',
                  willChange: 'transform',
                }}
              >
                {/* Inner screen */}
                <div className="absolute inset-[2px] rounded-sm overflow-hidden bg-black">
                  {box.isBase ? (
                    /* Base box - Heavy solid industrial support */
                    <div className="absolute inset-0">
                      {/* Heavy metallic base gradient */}
                      <div
                        className="w-full h-full"
                        style={{
                          background: 'linear-gradient(180deg, #3a3a3a 0%, #252525 20%, #1a1a1a 50%, #0d0d0d 80%, #000 100%)',
                          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), inset 0 -2px 4px rgba(0,0,0,0.8)',
                        }}
                      />
                      {/* Brushed metal texture */}
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{
                          backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
                        }}
                      />
                      {/* Top edge highlight */}
                      <div
                        className="absolute top-0 left-0 right-0 h-[2px]"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(225, 121, 36, 0.6) 20%, rgba(225, 121, 36, 0.8) 50%, rgba(225, 121, 36, 0.6) 80%, transparent 100%)',
                        }}
                      />
                      {/* Bottom shadow edge */}
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[3px]"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, #000 20%, #000 80%, transparent 100%)',
                        }}
                      />
                      {/* Corner bolts - left */}
                      <div
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, #4a4a4a 0%, #1a1a1a 50%, #0a0a0a 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.8)',
                        }}
                      />
                      {/* Corner bolts - right */}
                      <div
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-[8px] h-[8px] rounded-full"
                        style={{
                          background: 'radial-gradient(circle at 30% 30%, #4a4a4a 0%, #1a1a1a 50%, #0a0a0a 100%)',
                          boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.2), 0 1px 2px rgba(0,0,0,0.8)',
                        }}
                      />
                      {/* Center ridge/groove */}
                      <div
                        className="absolute left-[15%] right-[15%] top-1/2 -translate-y-1/2 h-[6px] rounded-sm"
                        style={{
                          background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a1a 40%, #2a2a2a 50%, #1a1a1a 60%, #0a0a0a 100%)',
                          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.9), 0 1px 1px rgba(255,255,255,0.05)',
                        }}
                      />
                      {/* Orange accent glow in center groove */}
                      <div
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30%] h-[2px]"
                        style={{
                          background: '#E17924',
                          boxShadow: '0 0 8px rgba(225, 121, 36, 0.8), 0 0 15px rgba(225, 121, 36, 0.4)',
                        }}
                      />
                    </div>
                  ) : (
                    /* Boxes 1-7: Each box has its own text */
                    <>
                      <div className="absolute inset-0 bg-black" style={{ zIndex: 1 }} />
                      <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
                        <motion.span
                          className="font-black tracking-wide text-center px-1 md:px-2"
                          style={{
                            fontSize: isMobileView
                              ? (box.text.length > 10 ? '9px' : '11px')
                              : (box.text.length > 10 ? '11px' : '14px'),
                            textTransform: 'uppercase',
                            letterSpacing: isMobileView ? '0.08em' : '0.1em',
                          }}
                          animate={{
                            background: isHovered
                              ? 'linear-gradient(90deg, #E17924 0%, #BA5617 50%, #E17924 100%)'
                              : 'linear-gradient(90deg, #E17924 0%, #994E1F 50%, #E17924 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: isHovered
                              ? 'drop-shadow(0 0 15px rgba(225, 121, 36, 1)) drop-shadow(0 0 30px rgba(186, 86, 23, 0.8))'
                              : 'drop-shadow(0 0 6px rgba(225, 121, 36, 0.5))',
                            scale: isHovered ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {box.text}
                        </motion.span>
                      </div>

                      {/* Scan line */}
                      <motion.div
                        className="absolute left-0 right-0 h-[2px] pointer-events-none"
                        style={{ zIndex: 3 }}
                        animate={{
                          top: ['100%', '0%'],
                          background: isHovered
                            ? 'linear-gradient(90deg, transparent 0%, rgba(225, 121, 36, 0.9) 50%, transparent 100%)'
                            : 'linear-gradient(90deg, transparent 0%, rgba(225, 121, 36, 0.6) 50%, transparent 100%)',
                        }}
                        transition={{
                          top: { duration: isHovered ? 1 : 2, repeat: Infinity, ease: 'linear', delay: index * 0.15 },
                          background: { duration: 0.3 },
                        }}
                      />

                      {/* Inner glow/shine effect on hover */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none rounded-sm"
                        style={{ zIndex: 4 }}
                        animate={{
                          boxShadow: isHovered
                            ? 'inset 0 0 25px rgba(225, 121, 36, 0.6), inset 0 0 50px rgba(186, 86, 23, 0.3)'
                            : 'inset 0 0 0px rgba(225, 121, 36, 0)',
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Back face - Sleek black with orange accent */}
              <div
                className="absolute inset-0 rounded-sm overflow-hidden"
                style={{
                  transform: 'translateZ(-10px) rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                  background: '#000000',
                  outline: '2px solid #E17924',
                  outlineOffset: '-2px',
                  willChange: 'transform',
                }}
              >
                {!box.isBase && (
                  <>
                    {/* Subtle grid pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: 'linear-gradient(#E17924 1px, transparent 1px), linear-gradient(90deg, #E17924 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    {/* Back text with orange glow */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span
                        className="font-black tracking-widest"
                        style={{
                          fontSize: isMobileView
                            ? (box.backText.length > 6 ? '10px' : '14px')
                            : (box.backText.length > 6 ? '12px' : '18px'),
                          color: '#E17924',
                          textShadow: '0 0 10px rgba(225, 121, 36, 0.8), 0 0 20px rgba(225, 121, 36, 0.4)',
                        }}
                      >
                        {box.backText}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* 3D Left edge - connects front to back */}
              {!box.isBase && (
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    left: 0,
                    width: '20px',
                    transform: 'rotateY(-90deg)',
                    transformOrigin: 'left center',
                    background: '#BA5617',
                    backfaceVisibility: 'hidden',
                  }}
                />
              )}

              {/* 3D Right edge - connects front to back */}
              {!box.isBase && (
                <div
                  className="absolute top-0 bottom-0"
                  style={{
                    right: 0,
                    width: '20px',
                    transform: 'rotateY(90deg)',
                    transformOrigin: 'right center',
                    background: '#BA5617',
                    backfaceVisibility: 'hidden',
                  }}
                />
              )}

              {/* 3D Top edge */}
              {!box.isBase && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    top: 0,
                    height: '20px',
                    transform: 'rotateX(90deg)',
                    transformOrigin: 'top center',
                    background: '#E17924',
                    backfaceVisibility: 'hidden',
                  }}
                />
              )}

              {/* 3D Bottom edge */}
              {!box.isBase && (
                <div
                  className="absolute left-0 right-0"
                  style={{
                    bottom: 0,
                    height: '20px',
                    transform: 'rotateX(-90deg)',
                    transformOrigin: 'bottom center',
                    background: '#994E1F',
                    backfaceVisibility: 'hidden',
                  }}
                />
              )}

              {/* Shadow underneath box */}
              <div
                className="absolute left-1/2 -translate-x-1/2 w-[85%] h-[8px] rounded-full"
                style={{
                  bottom: '-15px',
                  background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, transparent 70%)',
                  filter: 'blur(6px)',
                  transform: 'translateX(-50%) translateZ(-15px)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Ambient particles on hover */}
      {isHovered && (
        <>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: 'rgba(225, 121, 36, 0.6)' }}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                x: (Math.random() - 0.5) * 200,
                y: -200 - Math.random() * 150,
              }}
              transition={{
                duration: 3,
                delay: i * 0.25,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
              style={{
                left: `calc(50% + ${(Math.random() - 0.5) * 100}px)`,
                bottom: '35%',
              }}
            />
          ))}
        </>
      )}

      {/* Instruction text - different for mobile/desktop */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 text-white/40 text-xs md:text-sm"
        style={{ bottom: isMobileView ? '2%' : '5%' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3, delay: isMobileView ? 1 : 4 }}
      >
        {isMobileView ? 'Tap to animate' : ''}
      </motion.div>
    </motion.div>
  )
}

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
      {/* Mobile CSS animations */}
      {useMobileOptimizations && <style dangerouslySetInnerHTML={{ __html: mobileBoxStyles }} />}

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

          {/* Text Content - Below boxes on mobile, Left on desktop */}
          <div className="text-center lg:text-left order-2 md:order-1">
            {/* Main headline */}
            {useMobileOptimizations ? (
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 leading-none tracking-tight">
                <span className="text-white inline-block mobile-text-animate mobile-text-delay-1">
                  SCREENS
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar inline-block mobile-text-animate mobile-text-delay-2">
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
                  transition={{ duration: 0.8, delay: 3.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  SCREENS
                </motion.span>
                <br />
                <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar inline-block"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 3.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  THAT MOVE
                </motion.span>
              </motion.h1>
            )}

            {/* Sub-headline */}
            {useMobileOptimizations ? (
              <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light mobile-text-animate mobile-text-delay-3">
                Rotate. Flip. Captivate.
              </p>
            ) : (
              <motion.p
                className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 font-light"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 3.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                Rotate. Flip. Captivate.
              </motion.p>
            )}

            {/* Description */}
            {useMobileOptimizations ? (
              <p className="text-base md:text-lg text-white/60 mb-8 max-w-lg mx-auto lg:mx-0 mobile-text-animate mobile-text-delay-4">
                LED displays powered by precision motors that transform static screens into living, breathing installations.
              </p>
            ) : (
              <motion.p
                className="text-base md:text-lg text-white/60 mb-8 max-w-lg mx-auto lg:mx-0"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 3.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                LED displays powered by precision motors that transform static screens into living, breathing installations.
              </motion.p>
            )}

            {/* CTA Buttons */}
            {useMobileOptimizations ? (
              <div className="flex flex-row items-center justify-center lg:justify-start gap-3 mobile-text-animate mobile-text-delay-5 -translate-y-[10px]">
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
                transition={{ duration: 0.5, delay: 4.0, ease: [0.25, 0.1, 0.25, 1] }}
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
                      Book a Visit
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

          {/* Box Tower - Top on mobile, Right on desktop */}
          <div className="relative order-1 md:order-2 h-[340px] md:h-[450px] lg:h-[600px]">
            {/* Use CSS-based component on mobile for better performance */}
            {hasMounted && isMobile ? <MobileBoxTower /> : <RotatingBoxTower scrollProgress={scrollYProgress} />}
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

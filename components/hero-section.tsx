"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Rotating Box Tower Component (Desktop only)
function RotatingBoxTower() {
  const [isHovered, setIsHovered] = useState(false)
  const [hoverRotations, setHoverRotations] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0])
  const [activeBoxes, setActiveBoxes] = useState<boolean[]>([false, false, false, false, false, false, false, false])
  const containerRef = useRef(null)

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

  // Initial static rotations - moderate rotation with variation
  const initialRotations = [
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
  const generate180Rotations = (cycle: number) => {
    const newRotations: number[] = [0] // base stays fixed
    for (let i = 1; i < 8; i++) {
      // Alternate between 180 and 0 (or 360), with slight random variation
      const baseRotation = cycle % 2 === 0 ? 180 : 0
      const variation = (Math.random() - 0.5) * 20 // -10 to +10 variation
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
    animationInterval.current = setInterval(() => {
      setRotationCycle(prev => {
        const next = prev + 1
        setHoverRotations(generate180Rotations(next))
        return next
      })
    }, 3500) // Flip every 3.5 seconds
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    // Stop continuous animation
    if (animationInterval.current) {
      clearInterval(animationInterval.current)
      animationInterval.current = null
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

  // 1 base + 7 stacked boxes with colors, text, and back content (Frame 58 colors only)
  // Using solid black (#000000) for all back faces
  const boxes = [
    { id: 0, isBase: true, color: boxColors[0], text: '', backText: '', backColor: '#000000' },
    { id: 1, color: boxColors[1], text: 'YOUR VISION', backText: '360°', backColor: '#000000' },
    { id: 2, color: boxColors[2], text: 'CAPTIVATE', backText: 'ROTATE', backColor: '#000000' },
    { id: 3, color: boxColors[3], text: 'FLIP & ROTATE', backText: 'FLIP', backColor: '#000000' },
    { id: 4, color: boxColors[4], text: 'THAT MOVE', backText: 'MOTION', backColor: '#000000' },
    { id: 5, color: boxColors[5], text: 'LED SCREENS', backText: 'LED', backColor: '#000000' },
    { id: 6, color: boxColors[6], text: 'DYNAMIC', backText: 'POWER', backColor: '#000000' },
    { id: 7, color: boxColors[7], text: 'KINETIC', backText: 'KINETIC', backColor: '#000000' },
  ]

  return (
    <motion.div
      ref={containerRef}
      className="relative h-full w-full flex items-center justify-center cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 3.0, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Glow effect behind the tower - Frame 58 colors */}
      <motion.div
        className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[400px] lg:w-[500px] h-[400px] lg:h-[500px] pointer-events-none"
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
        className="absolute bottom-[12%] left-1/2 -translate-x-1/2 w-[300px] lg:w-[400px] h-[60px] lg:h-[80px]"
        animate={{
          opacity: isHovered ? 0.6 : 0.3,
        }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(225, 121, 36, 0.6) 0%, transparent 70%)',
          filter: 'blur(25px)',
        }}
      />

      {/* Box Tower */}
      <div
        className="relative flex flex-col-reverse items-center"
        style={{
          transform: 'translateY(8%) rotateX(5deg)',
          perspective: '1200px',
          transformStyle: 'preserve-3d',
        }}
      >

        {boxes.map((box, index) => (
          <motion.div
            key={box.id}
            className="relative"
            style={{
              marginTop: box.isBase ? 0 : -2,
              zIndex: boxes.length - index,
              transformStyle: 'preserve-3d',
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
                delay: box.isBase ? 0 : (isHovered ? index * 0.12 : 0),
                ease: [0.25, 0.1, 0.25, 1],
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
                  ? 'w-[220px] h-[60px] lg:w-[280px] lg:h-[70px]'
                  : 'w-[200px] h-[60px] lg:w-[250px] lg:h-[70px]'
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
                  transformStyle: 'preserve-3d',
                  background: '#111',
                  border: '2px solid #E17924',
                  boxShadow: '0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(225, 121, 36, 0.3)',
                }}
              >
                {/* Inner screen */}
                <div className="absolute inset-[2px] rounded-sm overflow-hidden bg-[#0a0a0a]">
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
                      <div className="absolute inset-0 bg-black" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.span
                          className="font-black tracking-wide text-center px-2"
                          style={{
                            fontSize: box.text.length > 10 ? '11px' : '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
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
                        className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
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

                      {/* Glow effect */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none rounded-sm"
                        animate={{
                          boxShadow: isHovered
                            ? 'inset 0 0 25px rgba(225, 121, 36, 0.6), inset 0 0 50px rgba(186, 86, 23, 0.3)'
                            : 'inset 0 0 10px rgba(225, 121, 36, 0.2)',
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
                  background: '#0a0a0a',
                  border: '2px solid #E17924',
                  boxShadow: '0 0 15px rgba(225, 121, 36, 0.3)',
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
                          fontSize: box.backText.length > 6 ? '12px' : '18px',
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

              {/* Left edge - visible during rotation */}
              <div
                className="absolute top-0 bottom-0 w-[20px]"
                style={{
                  left: 0,
                  transform: 'rotateY(-90deg) translateZ(10px)',
                  transformOrigin: 'left center',
                  background: 'linear-gradient(to right, #1a1a1a 0%, #E17924 50%, #1a1a1a 100%)',
                  borderTop: '2px solid #E17924',
                  borderBottom: '2px solid #E17924',
                }}
              />

              {/* Right edge - visible during rotation */}
              <div
                className="absolute top-0 bottom-0 w-[20px]"
                style={{
                  right: 0,
                  transform: 'rotateY(90deg) translateZ(10px)',
                  transformOrigin: 'right center',
                  background: 'linear-gradient(to left, #1a1a1a 0%, #E17924 50%, #1a1a1a 100%)',
                  borderTop: '2px solid #E17924',
                  borderBottom: '2px solid #E17924',
                }}
              />

              {/* Top edge - 3D depth */}
              <div
                className="absolute left-0 right-0 h-[20px]"
                style={{
                  top: 0,
                  transform: 'rotateX(90deg) translateZ(10px)',
                  transformOrigin: 'top center',
                  background: 'linear-gradient(to bottom, #E17924 0%, #1a1a1a 50%, #0a0a0a 100%)',
                  borderLeft: '2px solid #E17924',
                  borderRight: '2px solid #E17924',
                }}
              />

              {/* Bottom edge - 3D depth */}
              <div
                className="absolute left-0 right-0 h-[20px]"
                style={{
                  bottom: 0,
                  transform: 'rotateX(-90deg) translateZ(10px)',
                  transformOrigin: 'bottom center',
                  background: 'linear-gradient(to top, #E17924 0%, #1a1a1a 50%, #0d0d0d 100%)',
                  borderLeft: '2px solid #E17924',
                  borderRight: '2px solid #E17924',
                }}
              />

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
      </div>

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

      {/* Hover instruction text */}
      <motion.div
        className="absolute bottom-[5%] left-1/2 -translate-x-1/2 text-white/40 text-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.3, delay: 4 }}
      >
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

          {/* Right Side - Images on Mobile, Box Tower on Desktop */}
          <div className="relative order-2 h-[320px] md:h-[450px] lg:h-[600px]">
            {/* Mobile: Show 3 Images */}
            {useMobileOptimizations ? (
              <>
                {/* Main featured image - center */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] md:w-[320px] z-20 mobile-scale-in mobile-delay-2">
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

                {/* Top right image */}
                <div
                  className="absolute top-4 right-4 md:top-8 md:right-8 w-[145px] md:w-[200px] z-10 mobile-slide-right mobile-delay-3"
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

                {/* Bottom left image */}
                <div
                  className="absolute bottom-4 left-4 md:bottom-8 md:left-8 w-[130px] md:w-[180px] z-10 mobile-slide-left mobile-delay-4"
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
              </>
            ) : (
              /* Desktop: Show Rotating Box Tower */
              <RotatingBoxTower />
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

"use client"

import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// Triblock colors
const TRIBLOCK_COLORS = [
  { face1: '#E17924', face2: '#C0C0C0', face3: '#A8A8A8' },
  { face1: '#BA5617', face2: '#B8B8B8', face3: '#A0A0A0' },
  { face1: '#D4650E', face2: '#CACACA', face3: '#B0B0B0' },
  { face1: '#F28C38', face2: '#D0D0D0', face3: '#B8B8B8' },
  { face1: '#994E1F', face2: '#BEBEBE', face3: '#A8A8A8' },
]

// Flap colors
const FLAP_BASE_COLORS = [
  '#E17924', '#D97706', '#B45309', '#CA8A04', '#A16207', '#92400E',
]

// Configuration
const TRIBLOCK_ROWS = 12
const TRIBLOCK_COLS = 18
const FLAP_ROWS = 6
const FLAP_COLS = 11
const MATRIX_COLS = 6

// Mobile configuration - optimized sizes
const MOBILE_TRIBLOCK_ROWS = 8
const MOBILE_TRIBLOCK_COLS = 10
const MOBILE_FLAP_ROWS = 6
const MOBILE_FLAP_COLS = 10
const MOBILE_MATRIX_COLS = 6

// Helper function
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Hook to detect mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  return isMobile
}

// Generate blocks
function generateTriblocks(rows: number, cols: number) {
  const blocks = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const colorSet = TRIBLOCK_COLORS[Math.floor(Math.random() * TRIBLOCK_COLORS.length)]
      blocks.push({ id: `${row}-${col}`, row, col, colors: colorSet })
    }
  }
  return blocks
}

function generateFlapBlocks(rows: number, cols: number) {
  const blocks = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const baseColor = FLAP_BASE_COLORS[Math.floor(Math.random() * FLAP_BASE_COLORS.length)]
      const colorPool = [baseColor, adjustColor(baseColor, 25), adjustColor(baseColor, -20), adjustColor(baseColor, 15), adjustColor(baseColor, -10)]
      blocks.push({ id: `${row}-${col}`, row, col, baseColor, colorPool })
    }
  }
  return blocks
}

// HRMS Configuration
const HRMS_BOXES = [
  { id: 1, text: 'PAYROLL', backText: 'AUTO' },
  { id: 2, text: 'ATTENDANCE', backText: 'TRACK' },
  { id: 3, text: 'LEAVE', backText: 'MANAGE' },
  { id: 4, text: 'REPORTS', backText: 'DATA' },
  { id: 5, text: 'HRMS', backText: 'SYSTEM' },
]

const HRMS_PRIMARY = '#8B5CF6'
const HRMS_GLOW = 'rgba(139, 92, 246, 0.4)'
const HRMS_DARK = '#5B21B6'
const HRMS_SECONDARY = '#7C3AED'

// Product data
const products = [
  {
    id: "triblock",
    title: "TRIBLOCK",
    subtitle: "Pixel Walls",
    gradient: "from-orange-600 via-amber-500 to-yellow-600",
    accentColor: "#E17924",
    type: "triblock",
  },
  {
    id: "flap",
    title: "FLAP",
    subtitle: "Split Flap Display",
    gradient: "from-orange-600 via-amber-500 to-yellow-400",
    accentColor: "#f59e0b",
    type: "flap",
  },
  {
    id: "hrms",
    title: "HRMS",
    subtitle: "HR Management",
    gradient: "from-violet-600 via-purple-500 to-indigo-400",
    accentColor: "#8B5CF6",
    type: "hrms",
  },
  {
    id: "matrix",
    title: "MATRIX",
    subtitle: "Kinetic Screens",
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    accentColor: "#06b6d4",
    type: "matrix",
  },
]

// ============ MOBILE COMPONENTS ============

// Mobile Triblock Visual - Tap to animate
function MobileTriblockCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [blocks] = useState(() => generateTriblocks(MOBILE_TRIBLOCK_ROWS, MOBILE_TRIBLOCK_COLS))
  const [waveCenter, setWaveCenter] = useState<{ row: number; col: number } | null>(null)

  useEffect(() => {
    if (isActive) {
      // Trigger wave animation from center
      setWaveCenter({ row: Math.floor(MOBILE_TRIBLOCK_ROWS / 2), col: Math.floor(MOBILE_TRIBLOCK_COLS / 2) })
      const timeout = setTimeout(() => setWaveCenter(null), 1500)
      return () => clearTimeout(timeout)
    }
  }, [isActive])

  const getBlockIntensity = (row: number, col: number) => {
    if (!waveCenter) return 0
    const distance = Math.sqrt(Math.pow(row - waveCenter.row, 2) + Math.pow(col - waveCenter.col, 2))
    const maxDist = Math.sqrt(Math.pow(MOBILE_TRIBLOCK_ROWS, 2) + Math.pow(MOBILE_TRIBLOCK_COLS, 2)) / 2
    const time = Date.now() % 1500
    const wavePosition = (time / 1500) * maxDist * 2
    const proximity = Math.abs(distance - wavePosition)
    return proximity < 2 ? Math.max(0, 1 - proximity / 2) : 0
  }

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center cursor-pointer pt-8"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ transform: 'rotateX(-12deg) rotateY(15deg)', transformStyle: 'preserve-3d' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MOBILE_TRIBLOCK_COLS}, 22px)`, gap: '2px' }}>
          {blocks.map((block) => {
            const intensity = isActive ? getBlockIntensity(block.row, block.col) : 0
            return (
              <motion.div
                key={block.id}
                animate={{ y: intensity > 0.1 ? -4 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: 22,
                  height: 22,
                  background: `linear-gradient(145deg, ${adjustColor(block.colors.face1, 30)} 0%, ${block.colors.face1} 50%, ${adjustColor(block.colors.face1, -20)} 100%)`,
                  borderRadius: '2px',
                  boxShadow: intensity > 0.1
                    ? `0 6px 12px rgba(0,0,0,0.4), 0 0 15px rgba(225,121,36,${intensity * 0.6})`
                    : '0 2px 4px rgba(0,0,0,0.3)',
                }}
              />
            )
          })}
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-[50px]" style={{ background: 'radial-gradient(ellipse, rgba(225,121,36,0.4) 0%, transparent 70%)', filter: 'blur(15px)' }} />
      {/* Tap hint */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 uppercase tracking-wider"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to animate
      </motion.div>
    </motion.div>
  )
}

// Mobile Flap Block with multi-flip animation like desktop
function MobileFlapBlock({ baseColor, colorPool, delay, isFlipping }: { baseColor: string; colorPool: string[]; delay: number; isFlipping: boolean }) {
  const [flipAngle, setFlipAngle] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    if (isFlipping) {
      const delayTimer = setTimeout(() => {
        let flipNum = 0
        const flipTimer = setInterval(() => {
          setFlipAngle(prev => prev + 180)
          setColorIndex(prev => (prev + 1) % colorPool.length)
          flipNum++
          if (flipNum >= 4) clearInterval(flipTimer)
        }, 300)
        return () => clearInterval(flipTimer)
      }, delay)
      return () => clearTimeout(delayTimer)
    }
  }, [isFlipping, delay, colorPool.length])

  const currentColor = colorPool[colorIndex]

  return (
    <div style={{ width: 24, height: 30, perspective: '400px' }}>
      <div style={{
        width: '100%',
        height: '100%',
        transformStyle: 'preserve-3d',
        transform: `rotateX(${flipAngle}deg)`,
        transition: 'transform 0.25s ease-out',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${adjustColor(currentColor, 30)} 0%, ${currentColor} 48%, #080808 49%, #080808 51%, ${adjustColor(currentColor, -15)} 52%, ${adjustColor(currentColor, -25)} 100%)`,
          borderRadius: '2px',
          backfaceVisibility: 'hidden',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg, ${adjustColor(currentColor, 35)} 0%, ${adjustColor(currentColor, 5)} 48%, #080808 49%, #080808 51%, ${adjustColor(currentColor, -10)} 52%, ${adjustColor(currentColor, -20)} 100%)`,
          borderRadius: '2px',
          backfaceVisibility: 'hidden',
          transform: 'rotateX(180deg)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.4)',
        }} />
      </div>
    </div>
  )
}

// Mobile Flap Visual - Tap to flip
function MobileFlapCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [blocks] = useState(() => generateFlapBlocks(MOBILE_FLAP_ROWS, MOBILE_FLAP_COLS))
  const [flipCycle, setFlipCycle] = useState(0)

  useEffect(() => {
    if (isActive) {
      setFlipCycle(prev => prev + 1)
    }
  }, [isActive])

  const getDelay = (row: number, col: number) => {
    return (row + col) * 80
  }

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center cursor-pointer pt-8"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MOBILE_FLAP_COLS}, 24px)`, gap: '2px' }}>
        {blocks.map((block) => (
          <MobileFlapBlock
            key={`${block.id}-${flipCycle}`}
            baseColor={block.baseColor}
            colorPool={block.colorPool}
            delay={getDelay(block.row, block.col)}
            isFlipping={isActive}
          />
        ))}
      </div>
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 uppercase tracking-wider"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to flip
      </motion.div>
    </motion.div>
  )
}

// Mobile HRMS Visual - All 3 pillars visible with rotation and movement
function MobileHRMSCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [rotationPhase, setRotationPhase] = useState(0)
  const [movementPhase, setMovementPhase] = useState(0)

  useEffect(() => {
    if (isActive) {
      setRotationPhase(prev => prev + 1)
      setMovementPhase(prev => prev + 1)
    }
  }, [isActive])

  const getRotation = (pillarIndex: number, boxIndex: number) => {
    if (rotationPhase === 0) return 0
    const base = rotationPhase % 2 === 0 ? 180 : 0
    return base + (pillarIndex * 15) + (boxIndex * 10)
  }

  const getOffset = (pillarIndex: number) => {
    if (movementPhase === 0) return 0
    if (pillarIndex === 0) return movementPhase % 2 === 1 ? -40 : 0
    if (pillarIndex === 2) return movementPhase % 2 === 1 ? 40 : 0
    return 0
  }

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center cursor-pointer pt-6"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-end justify-center gap-3">
        {[0, 1, 2].map((pillarIndex) => (
          <motion.div
            key={pillarIndex}
            className="flex flex-col-reverse items-center gap-0.5"
            animate={{ x: getOffset(pillarIndex) }}
            transition={{ duration: 1, ease: 'easeInOut' }}
          >
            {HRMS_BOXES.slice(0, 4).map((box, boxIndex) => (
              <motion.div
                key={box.id}
                animate={isActive ? { rotateY: getRotation(pillarIndex, boxIndex) } : {}}
                transition={{ duration: 1.5, delay: pillarIndex * 0.1 + boxIndex * 0.05 }}
                style={{
                  width: 56,
                  height: 22,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* Front face */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
                  border: `1.5px solid ${HRMS_PRIMARY}`,
                  borderRadius: '3px',
                  boxShadow: `0 0 10px ${HRMS_GLOW}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateZ(6px)',
                  backfaceVisibility: 'hidden',
                }}>
                  <span style={{ fontSize: 6, fontWeight: 800, color: HRMS_PRIMARY, letterSpacing: '0.3px' }}>{box.text}</span>
                </div>
                {/* Back face */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
                  border: `1.5px solid ${HRMS_PRIMARY}`,
                  borderRadius: '3px',
                  boxShadow: `0 0 10px ${HRMS_GLOW}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: 'translateZ(-6px) rotateY(180deg)',
                  backfaceVisibility: 'hidden',
                }}>
                  <span style={{ fontSize: 6, fontWeight: 800, color: HRMS_PRIMARY }}>{box.backText}</span>
                </div>
                {/* Left edge */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  left: 0,
                  width: '12px',
                  transform: 'rotateY(-90deg)',
                  transformOrigin: 'left center',
                  background: `linear-gradient(to right, ${HRMS_DARK}, ${HRMS_SECONDARY})`,
                  backfaceVisibility: 'hidden',
                }} />
                {/* Right edge */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  width: '12px',
                  transform: 'rotateY(90deg)',
                  transformOrigin: 'right center',
                  background: `linear-gradient(to left, ${HRMS_DARK}, ${HRMS_SECONDARY})`,
                  backfaceVisibility: 'hidden',
                }} />
                {/* Top edge */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: 0,
                  height: '12px',
                  transform: 'rotateX(90deg)',
                  transformOrigin: 'top center',
                  background: HRMS_PRIMARY,
                  backfaceVisibility: 'hidden',
                }} />
                {/* Bottom edge */}
                <div style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '12px',
                  transform: 'rotateX(-90deg)',
                  transformOrigin: 'bottom center',
                  background: HRMS_DARK,
                  backfaceVisibility: 'hidden',
                }} />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>
      {/* Base */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{
          width: 200,
          height: 14,
          background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)',
          border: `1.5px solid ${HRMS_PRIMARY}`,
          borderRadius: '3px',
          boxShadow: `0 0 15px ${HRMS_GLOW}`,
        }}
      />
      <motion.div
        className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-white/40 uppercase tracking-wider"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to animate
      </motion.div>
    </motion.div>
  )
}

// Mobile Matrix Visual - All columns visible with smaller blocks
function MobileMatrixCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [wavePhase, setWavePhase] = useState(0)

  useEffect(() => {
    if (isActive) {
      setWavePhase(prev => prev + 1)
    }
  }, [isActive])

  const getOffset = (colIndex: number) => {
    if (wavePhase === 0) return 0
    const directions = [-1, 0, 1, 1, 0, -1]
    const multiplier = wavePhase % 2 === 0 ? 1 : -1
    return (directions[colIndex % 6] || 0) * multiplier * 20
  }

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center cursor-pointer pt-8"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ transform: 'rotateX(5deg) rotateY(-8deg)' }}>
        <div
          style={{
            display: 'flex',
            gap: '3px',
            padding: '8px',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
            borderRadius: '6px',
            border: '1px solid #2a2a40',
          }}
        >
          {Array.from({ length: MOBILE_MATRIX_COLS }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col" style={{ gap: '3px' }}>
              {[0, 1, 2].map((rowIndex) => (
                <motion.div
                  key={rowIndex}
                  animate={isActive ? { y: getOffset(colIndex) } : { y: 0 }}
                  transition={{ duration: 0.8, delay: colIndex * 0.05 }}
                  style={{
                    width: 46,
                    height: 42,
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.6) 0%, rgba(8,145,178,0.7) 50%, rgba(14,116,144,0.5) 100%)',
                    borderRadius: '3px',
                    border: '1px solid rgba(6,182,212,0.5)',
                    boxShadow: '0 0 12px rgba(6,182,212,0.4), inset 0 0 18px rgba(6,182,212,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)' }} />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 uppercase tracking-wider"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to wave
      </motion.div>
    </motion.div>
  )
}

// Mobile Bento Grid Layout
// Hook to detect when element is in view (once only)
function useInViewOnce(threshold = 0.5) {
  const ref = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element || hasAnimated) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          observer.disconnect()
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [hasAnimated, threshold])

  return { ref, hasAnimated }
}

// Mobile Product Card wrapper with auto-animate on scroll
function MobileProductCard({
  productId,
  children,
  title,
  subtitle,
  gradient,
  bgGradient,
  borderColor,
  height,
  onAnimate,
  isActive,
}: {
  productId: string
  children: React.ReactNode
  title: string
  subtitle: string
  gradient: string
  bgGradient: string
  borderColor: string
  height: number
  onAnimate: () => void
  isActive: boolean
}) {
  const { ref, hasAnimated } = useInViewOnce(0.6)
  const hasTriggeredRef = useRef(false)

  useEffect(() => {
    if (hasAnimated && !hasTriggeredRef.current) {
      hasTriggeredRef.current = true
      // Small delay before triggering animation
      setTimeout(() => onAnimate(), 300)
    }
  }, [hasAnimated, onAnimate])

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: bgGradient,
        border: `1px solid ${borderColor}`,
        height,
      }}
      whileTap={{ scale: 0.99 }}
      onClick={onAnimate}
    >
      {children}
      <div className="absolute top-3 left-3">
        <span className={`text-lg font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>{title}</span>
        <p className="text-[10px] text-white/50">{subtitle}</p>
      </div>
    </motion.div>
  )
}

function MobileShowcase() {
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const handleAnimate = useCallback((productId: string) => {
    setActiveCard(productId)
    // Reset after animation
    setTimeout(() => setActiveCard(null), 1500)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-black to-neutral-900 px-4 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Our Products</h2>
        <p className="text-sm text-white/50">Tap each product to see it in action</p>
      </div>

      {/* Single Column Layout - 1 product at a time, full width */}
      <div className="flex flex-col gap-4 max-w-lg mx-auto">
        {/* Triblock */}
        <MobileProductCard
          productId="triblock"
          title="TRIBLOCK"
          subtitle="Pixel Walls"
          gradient="from-orange-500 to-amber-400"
          bgGradient="linear-gradient(135deg, rgba(225,121,36,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(225,121,36,0.2)"
          height={300}
          onAnimate={() => handleAnimate('triblock')}
          isActive={activeCard === 'triblock'}
        >
          <MobileTriblockCard isActive={activeCard === 'triblock'} onTap={() => handleAnimate('triblock')} />
        </MobileProductCard>

        {/* Flap */}
        <MobileProductCard
          productId="flap"
          title="FLAP"
          subtitle="Split Flap Display"
          gradient="from-orange-500 to-yellow-400"
          bgGradient="linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(245,158,11,0.2)"
          height={290}
          onAnimate={() => handleAnimate('flap')}
          isActive={activeCard === 'flap'}
        >
          <MobileFlapCard isActive={activeCard === 'flap'} onTap={() => handleAnimate('flap')} />
        </MobileProductCard>

        {/* HRMS */}
        <MobileProductCard
          productId="hrms"
          title="HRMS"
          subtitle="HR Management System"
          gradient="from-violet-500 to-purple-400"
          bgGradient="linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(139,92,246,0.2)"
          height={220}
          onAnimate={() => handleAnimate('hrms')}
          isActive={activeCard === 'hrms'}
        >
          <MobileHRMSCard isActive={activeCard === 'hrms'} onTap={() => handleAnimate('hrms')} />
        </MobileProductCard>

        {/* Matrix */}
        <MobileProductCard
          productId="matrix"
          title="MATRIX"
          subtitle="Kinetic Screens"
          gradient="from-cyan-500 to-teal-400"
          bgGradient="linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(6,182,212,0.2)"
          height={230}
          onAnimate={() => handleAnimate('matrix')}
          isActive={activeCard === 'matrix'}
        >
          <MobileMatrixCard isActive={activeCard === 'matrix'} onTap={() => handleAnimate('matrix')} />
        </MobileProductCard>
      </div>

      {/* CTA */}
      <div className="text-center mt-8">
        <Link
          href="#booking"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-semibold"
        >
          <span>Request a Demo</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}

// ============ DESKTOP COMPONENTS ============

// Desktop Triblock Visual
function TriPrismBlock({ colors, intensity }: { colors: { face1: string; face2: string; face3: string }; intensity: number }) {
  const size = 38
  const lift = intensity > 0.1 ? -4 : 0

  return (
    <div style={{ width: size, height: size }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, ${adjustColor(colors.face1, 30)} 0%, ${colors.face1} 50%, ${adjustColor(colors.face1, -20)} 100%)`,
          borderRadius: '3px',
          transform: `translateY(${lift}px)`,
          transition: 'transform 0.3s ease-out, box-shadow 0.3s ease-out',
          boxShadow: intensity > 0.1
            ? `0 8px 20px rgba(0,0,0,0.4), 0 0 20px rgba(225,121,36,${intensity * 0.6}), inset 0 1px 2px rgba(255,255,255,0.3)`
            : '0 2px 4px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)',
        }}
      />
    </div>
  )
}

function TriblockVisual({ isActive }: { isActive: boolean }) {
  const [blocks] = useState(() => generateTriblocks(TRIBLOCK_ROWS, TRIBLOCK_COLS))
  const [activatedBlocks, setActivatedBlocks] = useState<Map<string, number>>(new Map())
  const gridRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isActive || !gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const blockSize = 34
    const maxRadius = 130
    const newActivated = new Map<string, number>()
    const centerCol = Math.floor(mouseX / blockSize)
    const centerRow = Math.floor(mouseY / blockSize)
    const checkRadius = Math.ceil(maxRadius / blockSize) + 1
    for (let row = Math.max(0, centerRow - checkRadius); row < Math.min(TRIBLOCK_ROWS, centerRow + checkRadius + 1); row++) {
      for (let col = Math.max(0, centerCol - checkRadius); col < Math.min(TRIBLOCK_COLS, centerCol + checkRadius + 1); col++) {
        const blockCenterX = col * blockSize + blockSize / 2
        const blockCenterY = row * blockSize + blockSize / 2
        const distance = Math.sqrt(Math.pow(mouseX - blockCenterX, 2) + Math.pow(mouseY - blockCenterY, 2))
        if (distance < maxRadius) {
          newActivated.set(`${row}-${col}`, Math.pow(1 - distance / maxRadius, 1.5))
        }
      }
    }
    setActivatedBlocks(newActivated)
  }, [isActive])

  return (
    <div
      className="relative scale-[0.75] lg:scale-100 origin-center"
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActivatedBlocks(new Map())}
    >
      <div ref={gridRef} style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-20deg) rotateY(25deg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${TRIBLOCK_COLS}, 38px)`, gap: '4px' }}>
          {blocks.map((block) => (
            <TriPrismBlock key={block.id} colors={block.colors} intensity={activatedBlocks.get(block.id) || 0} />
          ))}
        </div>
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[700px] h-[120px]" style={{ background: 'radial-gradient(ellipse, rgba(225,121,36,0.5) 0%, transparent 70%)', filter: 'blur(25px)' }} />
      </div>
    </div>
  )
}

// Desktop Flap Block
function FlapBlock({ baseColor, colorPool, isFlipped, delay }: { baseColor: string; colorPool: string[]; isFlipped: boolean; delay: number }) {
  const [colorIndex, setColorIndex] = useState(0)
  const [internalFlip, setInternalFlip] = useState(false)
  const [flipCount, setFlipCount] = useState(0)
  const flipIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isFlipped) {
      const timeout = setTimeout(() => {
        setInternalFlip(true)
        setFlipCount(1)
        flipIntervalRef.current = setInterval(() => {
          setInternalFlip(prev => !prev)
          setColorIndex(prev => (prev + 1) % colorPool.length)
          setFlipCount(prev => prev + 1)
        }, 1400)
      }, delay)
      return () => { clearTimeout(timeout); if (flipIntervalRef.current) clearInterval(flipIntervalRef.current) }
    } else {
      if (flipIntervalRef.current) clearInterval(flipIntervalRef.current)
      setInternalFlip(false)
      setColorIndex(0)
      setFlipCount(0)
    }
  }, [isFlipped, delay, colorPool.length])

  const currentColor = colorPool[colorIndex]
  const actualDelay = flipCount <= 1 ? delay : 0

  return (
    <div style={{ width: 60, height: 75, perspective: '500px' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          transformStyle: 'preserve-3d',
          transform: internalFlip ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1) ${actualDelay}ms`,
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${adjustColor(currentColor, 30)} 0%, ${currentColor} 50%, ${adjustColor(currentColor, -25)} 100%)`, borderRadius: '8px', backfaceVisibility: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, ${adjustColor(colorPool[(colorIndex + 1) % colorPool.length], 30)} 0%, ${colorPool[(colorIndex + 1) % colorPool.length]} 50%, ${adjustColor(colorPool[(colorIndex + 1) % colorPool.length], -25)} 100%)`, borderRadius: '8px', backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }} />
      </div>
    </div>
  )
}

function FlapVisual({ isActive }: { isActive: boolean }) {
  const [flapBlocks] = useState(() => generateFlapBlocks(FLAP_ROWS, FLAP_COLS))
  const [isFlapFlipped, setIsFlapFlipped] = useState(false)
  const [flapPattern, setFlapPattern] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const patternIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const getWaveDelay = useCallback((row: number, col: number, pattern: number) => {
    switch (pattern % 4) {
      case 0: return (row + col) * 80
      case 1: return Math.sqrt(Math.pow(row - FLAP_ROWS / 2, 2) + Math.pow(col - FLAP_COLS / 2, 2)) * 100
      case 2: return ((FLAP_ROWS - 1 - row) + (FLAP_COLS - 1 - col)) * 80
      case 3: return row * 120 + (col % 3) * 40
      default: return 0
    }
  }, [])

  useEffect(() => {
    if (isActive) {
      setTimeout(() => { setIsFlapFlipped(true); setFlapPattern(0) }, 300)
    } else {
      setIsFlapFlipped(false)
      setIsHovered(false)
      if (patternIntervalRef.current) clearInterval(patternIntervalRef.current)
    }
  }, [isActive])

  useEffect(() => {
    if (isHovered && isActive) {
      patternIntervalRef.current = setInterval(() => {
        setIsFlapFlipped(false)
        setTimeout(() => { setFlapPattern(prev => (prev + 1) % 4); setIsFlapFlipped(true) }, 200)
      }, 3000)
      return () => { if (patternIntervalRef.current) clearInterval(patternIntervalRef.current) }
    }
  }, [isHovered, isActive])

  return (
    <div
      className="relative scale-[0.8] lg:scale-100 origin-center"
      onMouseEnter={() => { if (isActive) { setIsHovered(true); setFlapPattern(prev => (prev + 1) % 4); setIsFlapFlipped(true) } }}
      onMouseLeave={() => { setIsHovered(false); if (patternIntervalRef.current) clearInterval(patternIntervalRef.current); if (isActive) setIsFlapFlipped(true) }}
      style={{ perspective: '1000px' }}
    >
      <div style={{ padding: '20px 24px', background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)', borderRadius: '12px', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)', transform: 'rotateX(5deg)', transformStyle: 'preserve-3d' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${FLAP_COLS}, 60px)`, gap: '6px' }}>
          {flapBlocks.map((block) => (
            <FlapBlock key={`${block.id}-${flapPattern}`} baseColor={block.baseColor} colorPool={block.colorPool} isFlipped={isFlapFlipped} delay={getWaveDelay(block.row, block.col, flapPattern)} />
          ))}
        </div>
      </div>
      <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-[780px] h-[100px]" style={{ background: 'radial-gradient(ellipse, rgba(225,121,36,0.5) 0%, transparent 70%)', filter: 'blur(30px)' }} />
    </div>
  )
}

// Desktop HRMS
function HRMSPillar({ towerIndex, isHovered, rotationCycle }: { towerIndex: number; isHovered: boolean; rotationCycle: number }) {
  const getRotation = (boxIndex: number, cycle: number) => {
    if (cycle === 0) return [0, 35, -40, 45, -35, 40][boxIndex] || 0
    return (cycle % 2 === 0 ? 180 : 0) + ((boxIndex * 7 + towerIndex * 3) % 11 - 5)
  }

  return (
    <div className="flex flex-col-reverse items-center" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
      {HRMS_BOXES.map((box, index) => (
        <div key={box.id} style={{ marginTop: index === 0 ? 0 : -2, zIndex: HRMS_BOXES.length - index, transformStyle: 'preserve-3d', transform: `rotateY(${getRotation(index + 1, rotationCycle)}deg)`, transition: `transform ${isHovered ? 2.5 : 2}s ease-in-out` }}>
          <div className="w-[130px] h-[46px]" style={{ transformStyle: 'preserve-3d' }}>
            <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(10px)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 15px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
              <span className="font-black text-[10px] tracking-wider" style={{ color: HRMS_PRIMARY }}>{box.text}</span>
            </div>
            <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(-12px) rotateY(180deg)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 15px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
              <span className="font-black text-[10px]" style={{ color: HRMS_PRIMARY }}>{box.backText}</span>
            </div>
            <div className="absolute top-0 bottom-0" style={{ left: 0, width: '24px', transform: 'rotateY(-90deg)', transformOrigin: 'left center', background: `linear-gradient(to right, ${HRMS_DARK}, ${HRMS_SECONDARY})`, backfaceVisibility: 'hidden' }} />
            <div className="absolute top-0 bottom-0" style={{ right: 0, width: '24px', transform: 'rotateY(90deg)', transformOrigin: 'right center', background: `linear-gradient(to left, ${HRMS_DARK}, ${HRMS_SECONDARY})`, backfaceVisibility: 'hidden' }} />
            <div className="absolute left-0 right-0" style={{ top: 0, height: '24px', transform: 'rotateX(90deg)', transformOrigin: 'top center', background: HRMS_PRIMARY, backfaceVisibility: 'hidden' }} />
            <div className="absolute left-0 right-0" style={{ bottom: 0, height: '24px', transform: 'rotateX(-90deg)', transformOrigin: 'bottom center', background: HRMS_DARK, backfaceVisibility: 'hidden' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function HRMSVisual({ isActive }: { isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const [movementPhase, setMovementPhase] = useState(0)
  const [rotationCycle, setRotationCycle] = useState(0)

  useEffect(() => {
    if (isHovered) {
      setMovementPhase(1)
      setRotationCycle(1)
      const m = setInterval(() => setMovementPhase(prev => (prev % 2) + 1), 3000)
      const r = setInterval(() => setRotationCycle(prev => prev + 1), 3500)
      return () => { clearInterval(m); clearInterval(r) }
    } else { setMovementPhase(0); setRotationCycle(0) }
  }, [isHovered])

  const getOffset = (i: number) => movementPhase === 0 ? 0 : (movementPhase === 1 ? 70 : 0) * (i === 0 ? -1 : i === 2 ? 1 : 0)

  return (
    <div className="relative scale-[0.75] lg:scale-100 origin-center" onMouseEnter={() => isActive && setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="flex flex-col items-center">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none" style={{ background: `radial-gradient(ellipse, ${HRMS_GLOW} 0%, transparent 70%)`, filter: 'blur(40px)' }} />
        <div className="flex items-end justify-center gap-8 mb-4">
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ transform: `translateX(${getOffset(i)}px)`, transition: 'transform 1.8s ease-in-out' }}>
              <HRMSPillar towerIndex={i} isHovered={isHovered} rotationCycle={rotationCycle} />
            </div>
          ))}
        </div>
        <div className="w-[560px] h-[42px]" style={{ transform: 'rotateX(5deg)', transformStyle: 'preserve-3d' }}>
          <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(12px)', background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 50%, #0d0d15 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 25px ${HRMS_GLOW}` }}>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[5px]" style={{ background: HRMS_PRIMARY }} />
          </div>
        </div>
      </div>
    </div>
  )
}

// Desktop Matrix
function MatrixVisual({ isActive }: { isActive: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  const [wavePhase, setWavePhase] = useState(0)
  const [activatedPillars, setActivatedPillars] = useState<Map<number, number[]>>(new Map())

  useEffect(() => {
    if (isHovered && isActive) {
      const i = setInterval(() => setWavePhase(prev => prev + 1), 1500)
      return () => clearInterval(i)
    } else setActivatedPillars(new Map())
  }, [isHovered, isActive])

  useEffect(() => {
    if (!isHovered || !isActive) return
    const m = wavePhase % 2 === 0 ? 1 : -1
    const dirs = [-1, 0, 1, 1, 0, -1]
    const newA = new Map<number, number[]>()
    for (let c = 0; c < MATRIX_COLS; c++) newA.set(c, [0, 1, 2].map(() => dirs[c] * m * 0.9))
    setActivatedPillars(newA)
  }, [wavePhase, isHovered, isActive])

  return (
    <div className="relative scale-[0.8] lg:scale-100 origin-center" style={{ perspective: '1000px' }} onMouseEnter={() => isActive && setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setWavePhase(0); setActivatedPillars(new Map()) }}>
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(8deg) rotateY(-12deg)' }}>
        <div style={{ display: 'flex', gap: '12px', padding: '70px 30px', background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)', borderRadius: '8px', border: '2px solid #2a2a40', boxShadow: '0 30px 60px rgba(0,0,0,0.6)', minHeight: '420px', alignItems: 'center' }}>
          {Array.from({ length: MATRIX_COLS }).map((_, colIndex) => {
            const offsets = activatedPillars.get(colIndex) || [0, 0, 0]
            return (
              <div key={colIndex} className="flex flex-col" style={{ gap: '3px' }}>
                {[0, 1, 2].map((rowIndex) => (
                  <div key={rowIndex} style={{ width: 120, height: 100, transform: `translateY(${offsets[rowIndex] * 50}px)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)', background: 'linear-gradient(135deg, rgba(6,182,212,0.6) 0%, rgba(8,145,178,0.7) 50%, rgba(14,116,144,0.5) 100%)', borderRadius: '4px', border: '1px solid rgba(6,182,212,0.5)', boxShadow: '0 0 25px rgba(6,182,212,0.5), inset 0 0 30px rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)' }} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2" style={{ width: '90%', height: '20px', background: 'linear-gradient(180deg, #2a2a40 0%, #1a1a2e 100%)', borderRadius: '0 0 8px 8px' }} />
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[100px]" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.35) 0%, transparent 70%)', filter: 'blur(25px)' }} />
      </div>
    </div>
  )
}

// Bento Card Component
function BentoCard({
  product,
  children,
  className = "",
  isHovered,
  onHover,
  onLeave,
  delay = 0
}: {
  product: typeof products[0]
  children: React.ReactNode
  className?: string
  isHovered: boolean
  onHover: () => void
  onLeave: () => void
  delay?: number
}) {
  return (
    <motion.div
      className={`relative rounded-3xl overflow-hidden cursor-pointer group ${className}`}
      style={{
        background: `linear-gradient(135deg, rgba(20,20,20,0.9) 0%, rgba(10,10,10,0.95) 100%)`,
        border: `1px solid rgba(255,255,255,0.08)`,
      }}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.1, 0.25, 1] }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
    >
      {/* Accent glow on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${product.accentColor}15 0%, transparent 70%)`,
        }}
      />

      {/* Border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: `inset 0 0 0 1px ${product.accentColor}40, 0 0 40px ${product.accentColor}20`,
        }}
      />

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="absolute top-5 left-6 z-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay + 0.2 }}
          >
            <h3 className={`text-2xl lg:text-3xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
              {product.title}
            </h3>
            <p className="text-sm text-white/40 font-medium">{product.subtitle}</p>
          </motion.div>
        </div>

        {/* Visual */}
        <div className="flex-1 flex items-center justify-center pt-16 pb-6 px-4">
          {children}
        </div>

        {/* Sparkle indicator */}
        <motion.div
          className="absolute top-5 right-6 z-20"
          animate={{
            opacity: isHovered ? 1 : 0.4,
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <Sparkles className="h-5 w-5" style={{ color: product.accentColor }} />
        </motion.div>
      </div>
    </motion.div>
  )
}

// Scaled-down visuals for Bento cards
function BentoTriblockVisual({ isActive }: { isActive: boolean }) {
  const [blocks] = useState(() => generateTriblocks(8, 12))
  const [activatedBlocks, setActivatedBlocks] = useState<Map<string, number>>(new Map())
  const gridRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const blockSize = 34
    const maxRadius = 110
    const newActivated = new Map<string, number>()
    const centerCol = Math.floor(mouseX / blockSize)
    const centerRow = Math.floor(mouseY / blockSize)
    const checkRadius = Math.ceil(maxRadius / blockSize) + 1
    for (let row = Math.max(0, centerRow - checkRadius); row < Math.min(8, centerRow + checkRadius + 1); row++) {
      for (let col = Math.max(0, centerCol - checkRadius); col < Math.min(12, centerCol + checkRadius + 1); col++) {
        const blockCenterX = col * blockSize + blockSize / 2
        const blockCenterY = row * blockSize + blockSize / 2
        const distance = Math.sqrt(Math.pow(mouseX - blockCenterX, 2) + Math.pow(mouseY - blockCenterY, 2))
        if (distance < maxRadius) {
          newActivated.set(`${row}-${col}`, Math.pow(1 - distance / maxRadius, 1.5))
        }
      }
    }
    setActivatedBlocks(newActivated)
  }, [])

  return (
    <div
      className="relative"
      style={{ perspective: '800px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActivatedBlocks(new Map())}
    >
      <div ref={gridRef} style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-15deg) rotateY(20deg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(12, 30px)`, gap: '4px' }}>
          {blocks.map((block) => {
            const intensity = activatedBlocks.get(block.id) || 0
            return (
              <div
                key={block.id}
                style={{
                  width: 30,
                  height: 30,
                  background: `linear-gradient(145deg, ${adjustColor(block.colors.face1, 40)} 0%, ${block.colors.face1} 50%, ${adjustColor(block.colors.face1, -15)} 100%)`,
                  borderRadius: '3px',
                  transform: `translateY(${intensity > 0.1 ? -5 : 0}px)`,
                  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                  boxShadow: intensity > 0.1
                    ? `0 8px 18px rgba(0,0,0,0.5), 0 0 20px rgba(225,121,36,${intensity * 0.6})`
                    : '0 3px 6px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              />
            )
          })}
        </div>
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[380px] h-[70px]" style={{ background: 'radial-gradient(ellipse, rgba(225,121,36,0.5) 0%, transparent 70%)', filter: 'blur(20px)' }} />
      </div>
    </div>
  )
}

// Content options for split-flap display - more colors for multi-layer effect
const FLAP_CONTENTS = [
  // Orange/amber tones (0-5)
  { type: 'color', bg: '#E17924' },
  { type: 'color', bg: '#D97706' },
  { type: 'color', bg: '#B45309' },
  { type: 'color', bg: '#F59E0B' },
  { type: 'color', bg: '#FBBF24' },
  { type: 'color', bg: '#FCD34D' },
  // Darker orange/brown (6-9)
  { type: 'color', bg: '#92400E' },
  { type: 'color', bg: '#78350F' },
  { type: 'color', bg: '#A16207' },
  { type: 'color', bg: '#CA8A04' },
  // Dark tones (10-13)
  { type: 'color', bg: '#1a1a1a' },
  { type: 'color', bg: '#2d2d2d' },
  { type: 'color', bg: '#404040' },
  { type: 'color', bg: '#171717' },
  // Warm browns (14-17)
  { type: 'color', bg: '#7C2D12' },
  { type: 'color', bg: '#9A3412' },
  { type: 'color', bg: '#C2410C' },
  { type: 'color', bg: '#EA580C' },
  // Letters for "FLAP" (18-21)
  { type: 'text', value: 'F', bg: '#1a1a1a', color: '#E17924' },
  { type: 'text', value: 'L', bg: '#1a1a1a', color: '#F59E0B' },
  { type: 'text', value: 'A', bg: '#1a1a1a', color: '#D97706' },
  { type: 'text', value: 'P', bg: '#1a1a1a', color: '#FBBF24' },
  // Letters for "HELLO" (22-26)
  { type: 'text', value: 'H', bg: '#E17924', color: '#fff' },
  { type: 'text', value: 'E', bg: '#D97706', color: '#fff' },
  { type: 'text', value: 'L', bg: '#B45309', color: '#fff' },
  { type: 'text', value: 'L', bg: '#F59E0B', color: '#fff' },
  { type: 'text', value: 'O', bg: '#FBBF24', color: '#fff' },
  // Letters for "2024" (27-30)
  { type: 'text', value: '2', bg: '#1a1a1a', color: '#E17924' },
  { type: 'text', value: '0', bg: '#1a1a1a', color: '#F59E0B' },
  { type: 'text', value: '2', bg: '#1a1a1a', color: '#D97706' },
  { type: 'text', value: '4', bg: '#1a1a1a', color: '#FBBF24' },
  // Extra letters KINE (31-34)
  { type: 'text', value: 'K', bg: '#E17924', color: '#fff' },
  { type: 'text', value: 'I', bg: '#D97706', color: '#fff' },
  { type: 'text', value: 'N', bg: '#B45309', color: '#fff' },
  { type: 'text', value: 'E', bg: '#F59E0B', color: '#fff' },
]

// Different settled patterns that cycle - 5 rows x 8 cols - each shows words
const SETTLED_PATTERNS = [
  // Pattern 1: "FLAP" centered with color accents
  [
    [0, 10, 10, 10, 10, 10, 10, 1],
    [10, 10, 18, 19, 20, 21, 10, 10],
    [6, 10, 10, 10, 10, 10, 10, 7],
    [2, 10, 10, 10, 10, 10, 10, 3],
    [10, 4, 10, 10, 10, 10, 0, 10],
  ],
  // Pattern 2: "HELLO" with color bar
  [
    [10, 10, 10, 10, 10, 10, 10, 10],
    [10, 22, 23, 24, 25, 26, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [0, 1, 2, 3, 4, 5, 0, 1],
    [14, 15, 16, 17, 14, 15, 16, 17],
  ],
  // Pattern 3: "2024" with decorations
  [
    [6, 10, 0, 10, 10, 1, 10, 7],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [10, 27, 28, 29, 30, 10, 10, 10],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [8, 10, 2, 10, 10, 3, 10, 9],
  ],
  // Pattern 4: Checkered with KINE and FLAP
  [
    [0, 10, 1, 10, 2, 10, 3, 10],
    [10, 31, 10, 32, 10, 33, 10, 34],
    [4, 10, 5, 10, 0, 10, 1, 10],
    [10, 18, 10, 19, 10, 20, 10, 21],
    [6, 10, 7, 10, 8, 10, 9, 10],
  ],
  // Pattern 5: Wave with HELLO
  [
    [0, 1, 2, 3, 4, 5, 0, 1],
    [14, 15, 16, 17, 14, 15, 16, 17],
    [22, 23, 24, 25, 26, 10, 10, 10],
    [6, 7, 8, 9, 6, 7, 8, 9],
    [3, 4, 0, 1, 2, 3, 4, 0],
  ],
]

// Sequence of colors for each flip - distinct colors to show layers
const FLIP_COLOR_SEQUENCE = [
  '#E17924', // bright orange
  '#1a1a1a', // dark
  '#F59E0B', // amber
  '#78350F', // dark brown
  '#FBBF24', // yellow
  '#404040', // gray
  '#D97706', // orange
  '#2d2d2d', // dark gray
]

// Multi-flip block - flips through multiple pages before settling
function BentoFlapBlock({
  delay,
  finalContent,
  flipCount
}: {
  delay: number
  finalContent: number
  flipCount: number
}) {
  const [currentColor, setCurrentColor] = useState<string | null>(null)
  const [flipAngle, setFlipAngle] = useState(0)
  const [showFinalContent, setShowFinalContent] = useState(false)

  useEffect(() => {
    // Start multi-flip after delay - runs once on mount
    const delayTimer = setTimeout(() => {
      let flipNum = 0

      // Multiple flips with distinct color for each
      const flipTimer = setInterval(() => {
        // Rotate by 180 degrees each flip
        setFlipAngle(prev => prev + 180)
        // Show next color in sequence
        setCurrentColor(FLIP_COLOR_SEQUENCE[flipNum % FLIP_COLOR_SEQUENCE.length])
        flipNum++

        if (flipNum >= flipCount) {
          clearInterval(flipTimer)
          // Final settle to target content
          setTimeout(() => {
            setFlipAngle(prev => prev + 180)
            setCurrentColor(null)
            setShowFinalContent(true)
          }, 400)
        }
      }, 450) // 450ms per flip

      return () => clearInterval(flipTimer)
    }, delay)

    return () => clearTimeout(delayTimer)
  }, []) // Empty deps - runs once on mount

  const finalContentData = FLAP_CONTENTS[finalContent] || FLAP_CONTENTS[10]

  // Determine what to show - either a flip color or final content
  const displayBg = showFinalContent
    ? finalContentData.bg
    : (currentColor || finalContentData.bg)

  return (
    <div style={{ width: 32, height: 40, perspective: '500px' }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${flipAngle}deg)`,
          transition: 'transform 0.38s ease-out',
        }}
      >
        {/* Front face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg,
              ${adjustColor(displayBg, 35)} 0%,
              ${displayBg} 48.5%,
              #080808 49%,
              #080808 51%,
              ${adjustColor(displayBg, -8)} 51.5%,
              ${adjustColor(displayBg, -20)} 100%)`,
            borderRadius: '3px',
            backfaceVisibility: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showFinalContent && finalContentData.type === 'text' && (
            <span style={{
              fontSize: '16px',
              fontWeight: 900,
              color: finalContentData.color,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {finalContentData.value}
            </span>
          )}
        </div>
        {/* Back face */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg,
              ${adjustColor(displayBg, 40)} 0%,
              ${adjustColor(displayBg, 10)} 48.5%,
              #080808 49%,
              #080808 51%,
              ${adjustColor(displayBg, -5)} 51.5%,
              ${adjustColor(displayBg, -15)} 100%)`,
            borderRadius: '3px',
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showFinalContent && finalContentData.type === 'text' && (
            <span style={{
              fontSize: '16px',
              fontWeight: 900,
              color: finalContentData.color,
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              fontFamily: 'system-ui, sans-serif',
            }}>
              {finalContentData.value}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

function BentoFlapVisual({ isActive }: { isActive: boolean }) {
  const [animationCycle, setAnimationCycle] = useState(0)
  const [patternIndex, setPatternIndex] = useState(0)
  const rows = 6
  const cols = 11

  const getWaveDelay = useCallback((row: number, col: number, patternIdx: number) => {
    // Larger delays so wave effect is clearly visible - each block starts 100ms after previous
    switch (patternIdx % 5) {
      case 0:
        // Top-left corner - distance from (0,0)
        return (row + col) * 100
      case 1:
        // Center/middle - distance from center
        return Math.sqrt(Math.pow(row - rows/2, 2) + Math.pow(col - cols/2, 2)) * 120
      case 2:
        // Bottom-right corner - distance from (rows-1, cols-1)
        return ((rows - 1 - row) + (cols - 1 - col)) * 100
      case 3:
        // Top-right corner - distance from (0, cols-1)
        return (row + (cols - 1 - col)) * 100
      case 4:
        // Bottom-left corner - distance from (rows-1, 0)
        return ((rows - 1 - row) + col) * 100
      default: return 0
    }
  }, [rows, cols])

  useEffect(() => {
    if (!isActive) {
      return
    }

    const runAnimation = () => {
      // Increment cycle to trigger fresh animation
      setAnimationCycle(prev => prev + 1)
      // Update pattern
      setPatternIndex(prev => (prev + 1) % SETTLED_PATTERNS.length)
    }

    // Initial delay
    const initialTimeout = setTimeout(runAnimation, 800)

    // Repeat every 10 seconds - one animation cycle, then long pause
    const interval = setInterval(runAnimation, 10000)

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [isActive])

  // Extend patterns to 6x11 by repeating/tiling
  const getExtendedContent = (row: number, col: number) => {
    const basePattern = SETTLED_PATTERNS[patternIndex]
    const baseRow = row % 5
    const baseCol = col % 8
    return basePattern[baseRow]?.[baseCol] ?? 10
  }

  return (
    <div className="relative w-full h-full flex items-start justify-center mt-12" style={{ perspective: '800px' }}>
      <div style={{
        padding: '0',
        transform: 'rotateX(5deg)',
        transformStyle: 'preserve-3d'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 32px)`, gap: '2px' }}>
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / cols)
            const col = index % cols
            const finalContent = getExtendedContent(row, col)
            return (
              <BentoFlapBlock
                key={`${row}-${col}-${animationCycle}`}
                delay={getWaveDelay(row, col, patternIndex)}
                finalContent={finalContent}
                flipCount={4 + (index % 3)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function BentoHRMSVisual({ isActive }: { isActive: boolean }) {
  const [rotationCycle, setRotationCycle] = useState(0)
  const [movementPhase, setMovementPhase] = useState(0)

  useEffect(() => {
    if (isActive) {
      setRotationCycle(1)
      setMovementPhase(1)
      const r = setInterval(() => setRotationCycle(prev => prev + 1), 3000)
      const m = setInterval(() => setMovementPhase(prev => (prev % 2) + 1), 2500)
      return () => { clearInterval(r); clearInterval(m) }
    } else {
      setRotationCycle(0)
      setMovementPhase(0)
    }
  }, [isActive])

  const getRotation = (pillarIndex: number, boxIndex: number, cycle: number) => {
    if (cycle === 0) return [0, 25, -30, 35, -25][boxIndex] || 0
    return (cycle % 2 === 0 ? 180 : 0) + ((boxIndex * 5 + pillarIndex * 3) % 8 - 4)
  }

  // Horizontal movement: left pillar goes left, right pillar goes right
  const getOffset = (pillarIndex: number) => {
    if (movementPhase === 0) return 0
    if (pillarIndex === 0) return movementPhase === 1 ? -60 : 0  // Left pillar
    if (pillarIndex === 2) return movementPhase === 1 ? 60 : 0   // Right pillar
    return 0  // Center pillar stays
  }

  return (
    <div className="relative">
      <div className="flex items-end justify-center gap-6">
        {[0, 1, 2].map((pillarIndex) => (
          <div
            key={pillarIndex}
            className="flex flex-col-reverse items-center"
            style={{
              perspective: '600px',
              transformStyle: 'preserve-3d',
              transform: `translateX(${getOffset(pillarIndex)}px)`,
              transition: 'transform 1.5s ease-in-out',
            }}
          >
            {HRMS_BOXES.slice(0, 4).map((box, boxIndex) => (
              <div
                key={box.id}
                style={{
                  marginTop: boxIndex === 0 ? 0 : -1,
                  zIndex: 4 - boxIndex,
                  transformStyle: 'preserve-3d',
                  transform: `rotateY(${getRotation(pillarIndex, boxIndex, rotationCycle)}deg)`,
                  transition: 'transform 2s ease-in-out',
                }}
              >
                <div className="w-[90px] h-[32px]" style={{ transformStyle: 'preserve-3d' }}>
                  {/* Front face */}
                  <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(8px)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `1.5px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 12px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
                    <span className="font-black text-[8px] tracking-wider" style={{ color: HRMS_PRIMARY }}>{box.text}</span>
                  </div>
                  {/* Back face */}
                  <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(-8px) rotateY(180deg)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `1.5px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 12px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
                    <span className="font-black text-[8px]" style={{ color: HRMS_PRIMARY }}>{box.backText}</span>
                  </div>
                  {/* Left edge */}
                  <div className="absolute top-0 bottom-0" style={{ left: 0, width: '16px', transform: 'rotateY(-90deg)', transformOrigin: 'left center', background: `linear-gradient(to right, ${HRMS_DARK}, ${HRMS_SECONDARY})`, backfaceVisibility: 'hidden' }} />
                  {/* Right edge */}
                  <div className="absolute top-0 bottom-0" style={{ right: 0, width: '16px', transform: 'rotateY(90deg)', transformOrigin: 'right center', background: `linear-gradient(to left, ${HRMS_DARK}, ${HRMS_SECONDARY})`, backfaceVisibility: 'hidden' }} />
                  {/* Top edge */}
                  <div className="absolute left-0 right-0" style={{ top: 0, height: '16px', transform: 'rotateX(90deg)', transformOrigin: 'top center', background: HRMS_PRIMARY, backfaceVisibility: 'hidden' }} />
                  {/* Bottom edge */}
                  <div className="absolute left-0 right-0" style={{ bottom: 0, height: '16px', transform: 'rotateX(-90deg)', transformOrigin: 'bottom center', background: HRMS_DARK, backfaceVisibility: 'hidden' }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* Base */}
      <div className="mt-3 mx-auto w-[340px] h-[24px]" style={{ background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)', border: `1.5px solid ${HRMS_PRIMARY}`, borderRadius: '4px', boxShadow: `0 0 20px ${HRMS_GLOW}` }} />
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[400px] h-[70px]" style={{ background: `radial-gradient(ellipse, ${HRMS_GLOW} 0%, transparent 70%)`, filter: 'blur(25px)' }} />
    </div>
  )
}

function BentoMatrixVisual({ isActive }: { isActive: boolean }) {
  const [wavePhase, setWavePhase] = useState(0)

  useEffect(() => {
    if (isActive) {
      const i = setInterval(() => setWavePhase(prev => prev + 1), 1200)
      return () => clearInterval(i)
    }
  }, [isActive])

  const getOffset = (colIndex: number) => {
    if (!isActive) return 0
    const dirs = [-1, 0, 1, 1, 0, -1]
    const m = wavePhase % 2 === 0 ? 1 : -1
    return dirs[colIndex % 6] * m * 0.7
  }

  return (
    <div className="relative" style={{ perspective: '800px' }}>
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(6deg) rotateY(-10deg)' }}>
        <div style={{ display: 'flex', gap: '6px', padding: '20px 16px', background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)', borderRadius: '8px', border: '1.5px solid #2a2a40', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
          {Array.from({ length: 6 }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col" style={{ gap: '3px' }}>
              {[0, 1, 2].map((rowIndex) => (
                <div
                  key={rowIndex}
                  style={{
                    width: 44,
                    height: 36,
                    transform: `translateY(${getOffset(colIndex) * 30}px)`,
                    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.5) 0%, rgba(8,145,178,0.6) 50%, rgba(14,116,144,0.4) 100%)',
                    borderRadius: '3px',
                    border: '1px solid rgba(6,182,212,0.4)',
                    boxShadow: '0 0 15px rgba(6,182,212,0.3), inset 0 0 15px rgba(6,182,212,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.7) 0%, transparent 70%)' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[300px] h-[50px]" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.35) 0%, transparent 70%)', filter: 'blur(15px)' }} />
    </div>
  )
}

// Desktop Bento Grid Showcase
function DesktopShowcase() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-black py-20 px-6 lg:px-12 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />

      {/* Ambient glows */}
      <motion.div
        className="absolute top-20 right-20 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20"
        animate={{
          background: hoveredCard
            ? `radial-gradient(circle, ${products.find(p => p.id === hoveredCard)?.accentColor || '#E17924'}, transparent)`
            : 'radial-gradient(circle, #E17924, transparent)'
        }}
        transition={{ duration: 0.8 }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
        animate={{
          background: hoveredCard
            ? `radial-gradient(circle, ${products.find(p => p.id === hoveredCard)?.accentColor || '#8B5CF6'}, transparent)`
            : 'radial-gradient(circle, #8B5CF6, transparent)'
        }}
        transition={{ duration: 0.8 }}
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Our <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Products</span>
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Interactive kinetic displays that captivate and engage. Hover to explore each product.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-3 grid-rows-[360px_280px] gap-5">
          {/* TRIBLOCK - Large Featured (spans 2 cols, 1 row) */}
          <BentoCard
            product={products[0]}
            className="col-span-2 row-span-1"
            isHovered={hoveredCard === 'triblock'}
            onHover={() => setHoveredCard('triblock')}
            onLeave={() => setHoveredCard(null)}
            delay={0}
          >
            <BentoTriblockVisual isActive={hoveredCard === 'triblock' || hoveredCard === null} />
          </BentoCard>

          {/* FLAP - Medium (1 col, 1 row) */}
          <BentoCard
            product={products[1]}
            className="col-span-1 row-span-1"
            isHovered={hoveredCard === 'flap'}
            onHover={() => setHoveredCard('flap')}
            onLeave={() => setHoveredCard(null)}
            delay={0.1}
          >
            <BentoFlapVisual isActive={hoveredCard === 'flap' || hoveredCard === null} />
          </BentoCard>

          {/* MATRIX - Medium (1 col, 1 row) */}
          <BentoCard
            product={products[3]}
            className="col-span-1 row-span-1"
            isHovered={hoveredCard === 'matrix'}
            onHover={() => setHoveredCard('matrix')}
            onLeave={() => setHoveredCard(null)}
            delay={0.2}
          >
            <BentoMatrixVisual isActive={hoveredCard === 'matrix' || hoveredCard === null} />
          </BentoCard>

          {/* HRMS - Wide (spans 2 cols, 1 row) for pillar movement */}
          <BentoCard
            product={products[2]}
            className="col-span-2 row-span-1"
            isHovered={hoveredCard === 'hrms'}
            onHover={() => setHoveredCard('hrms')}
            onLeave={() => setHoveredCard(null)}
            delay={0.3}
          >
            <BentoHRMSVisual isActive={hoveredCard === 'hrms' || hoveredCard === null} />
          </BentoCard>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link
            href="#booking"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-orange-600 via-amber-500 to-yellow-500 text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-orange-500/25"
          >
            <span>Request a Demo</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// Main component
export default function ScrollProductShowcase() {
  const isMobile = useIsMobile()
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return <div className="min-h-screen bg-black" />

  return isMobile ? <MobileShowcase /> : <DesktopShowcase />
}

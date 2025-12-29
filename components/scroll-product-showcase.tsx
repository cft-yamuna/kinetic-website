"use client"

import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
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

// HRMS uses warm amber from brand palette
const HRMS_PRIMARY = '#EF9145'
const HRMS_GLOW = 'rgba(239, 145, 69, 0.4)'
const HRMS_DARK = '#994E1F'
const HRMS_SECONDARY = '#BA5617'

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
    id: "trihelix",
    title: "TRI-HELIX",
    subtitle: "Panoramic Display",
    gradient: "from-orange-500 via-amber-500 to-orange-600",
    accentColor: "#E17924",
    type: "trihelix",
  },
  {
    id: "hrms",
    title: "HRMS",
    subtitle: "HR Management",
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    accentColor: "#EF9145",
    type: "hrms",
  },
  {
    id: "matrix",
    title: "MATRIX",
    subtitle: "Kinetic Screens",
    gradient: "from-amber-500 via-yellow-400 to-orange-400",
    accentColor: "#F5A623",
    type: "matrix",
  },
]

// ============ MOBILE COMPONENTS ============

// Mobile Triblock Visual
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
    </motion.div>
  )
}

// Mobile Matrix Visual - Movement animation
function MobileMatrixCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [wavePhase, setWavePhase] = useState(0)

  useEffect(() => {
    if (isActive) {
      // Movement wave
      setWavePhase(prev => prev + 1)
    }
  }, [isActive])

  // Wave offsets for columns
  const getOffset = (colIndex: number) => {
    if (wavePhase === 0) return 0
    const directions = [-1, 0, 1, 1, 0, -1]
    const multiplier = wavePhase % 2 === 0 ? 1 : -1
    return (directions[colIndex % 6] || 0) * multiplier * 15
  }

  // Brand orange color from palette #E17924
  const colors = {
    bg: 'rgba(225,121,36,0.85)',
    border: 'rgba(186,86,23,0.7)',
    glow: 'rgba(225,121,36,0.5)',
    dark: 'rgba(108,42,0,0.9)'
  }

  return (
    <motion.div
      className="relative w-full flex items-center justify-center cursor-pointer"
      style={{ minHeight: '220px', paddingTop: '50px', paddingBottom: '20px' }}
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ transform: 'rotateX(5deg) rotateY(-8deg)' }}>
        <div
          style={{
            display: 'flex',
            gap: '3px',
            padding: '10px',
            background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
            borderRadius: '6px',
            border: '1px solid #333',
          }}
        >
          {Array.from({ length: MOBILE_MATRIX_COLS }).map((_, colIndex) => {
            return (
              <div key={colIndex} className="flex flex-col" style={{ gap: '3px' }}>
                {[0, 1, 2].map((rowIndex) => (
                  <motion.div
                    key={rowIndex}
                    animate={isActive ? { y: getOffset(colIndex) } : { y: 0 }}
                    transition={{ duration: 0.8, delay: colIndex * 0.05 }}
                    style={{
                      width: 46,
                      height: 40,
                      background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.dark} 100%)`,
                      borderRadius: '3px',
                      border: `1px solid ${colors.border}`,
                      boxShadow: `0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.8)',
                      boxShadow: `0 0 6px rgba(255,255,255,0.6)`,
                    }} />
                  </motion.div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// Mobile TRI-HELIX Visual - Wings open/close, 360 rotation, fixed base
function MobileTriHelixCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [wingAngle, setWingAngle] = useState(0)
  const [layerRotations, setLayerRotations] = useState<number[]>([0, 0, 0, 0, 0])
  const [rotationCycle, setRotationCycle] = useState(0)
  const [contentPhase, setContentPhase] = useState(0)
  const layers = 5
  const layerHeight = 30
  const layerGap = 5
  const panelWidth = 60

  // Content for each layer
  const layerContent = [
    { closed: 'UNFOLD', open: 'YOUR', rotating: 'TRI' },
    { closed: 'THE', open: 'BRAND', rotating: 'HELIX' },
    { closed: 'FUTURE', open: 'IN', rotating: 'LED' },
    { closed: 'OF', open: '3D', rotating: '360°' },
    { closed: 'LED', open: 'SPACE', rotating: 'WOW' },
  ]

  useEffect(() => {
    if (isActive) {
      // Open wings slowly
      setWingAngle(120)
      setContentPhase(1)

      // Close wings after holding (slower)
      setTimeout(() => {
        setWingAngle(0)
      }, 2500)

      // Rotate each layer like DNA (180 degree flip with stagger)
      setTimeout(() => {
        setContentPhase(2)
        const nextCycle = rotationCycle + 1
        setRotationCycle(nextCycle)
        const baseRotation = nextCycle % 2 === 0 ? 0 : 180
        const newRotations = [0, 1, 2, 3, 4].map((i) => {
          const variation = ((i * 7) % 11 - 5)
          return baseRotation + variation
        })
        setLayerRotations(newRotations)
      }, 3500)

      // Return to home position (all straight)
      setTimeout(() => {
        setLayerRotations([0, 0, 0, 0, 0])
        setContentPhase(0)
      }, 5500)
    }
  }, [isActive])

  const totalHeight = layers * (layerHeight + layerGap)

  return (
    <motion.div
      className="relative w-full h-full flex flex-col items-center justify-center cursor-pointer"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ perspective: '500px', marginTop: '10px', marginLeft: '25px' }}>
        {/* Column container - faces straight front */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            transform: 'rotateX(5deg)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: `${layerGap}px`,
          }}
        >
          {Array.from({ length: layers }).map((_, layerIndex) => {
            // Each layer has its own rotation - home position is straight (0)
            const layerRotation = layerRotations[layerIndex]
            const content = layerContent[layerIndex]
            const displayText = contentPhase === 0 ? content.closed : contentPhase === 1 ? content.open : content.rotating

            return (
            <div
              key={layerIndex}
              style={{
                position: 'relative',
                transform: `rotateY(${layerRotation}deg)`,
                transition: `transform 2s ease-in-out ${layerIndex * 0.1}s`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Center Panel */}
              <div
                style={{
                  width: panelWidth,
                  height: layerHeight,
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                  border: '1.5px solid #E17924',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  transform: 'translateZ(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '85%', height: '65%', background: '#0a0a0a', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <span style={{ color: '#E17924', fontSize: '8px', fontWeight: 'bold', letterSpacing: '0.5px' }}>{displayText}</span>
                </div>
              </div>
              {/* Left Wing */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: panelWidth,
                  height: layerHeight,
                  transformOrigin: 'right center',
                  transform: `translateX(-${panelWidth}px) translateZ(10px) rotateY(${-120 + wingAngle}deg)`,
                  transition: 'transform 2s ease-in-out',
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                  border: '1.5px solid #BA5617',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '85%', height: '65%', background: '#0a0a0a', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <span style={{ color: '#E17924', fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {['KINETIC', 'MOTION', 'VISUAL', 'IMPACT', 'WOW'][layerIndex]}
                  </span>
                </div>
              </div>
              {/* Right Wing */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: panelWidth,
                  height: layerHeight,
                  transformOrigin: 'left center',
                  transform: `translateX(${panelWidth}px) translateZ(10px) rotateY(${120 - wingAngle}deg)`,
                  transition: 'transform 2s ease-in-out',
                  background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
                  border: '1.5px solid #BA5617',
                  borderRadius: '3px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div style={{ width: '85%', height: '65%', background: '#0a0a0a', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <span style={{ color: '#E17924', fontSize: '7px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
                    {['SCREENS', 'DISPLAY', 'CONTENT', 'BRANDS', 'AMAZE'][layerIndex]}
                  </span>
                </div>
              </div>
            </div>
          )
          })}
        </div>
      </div>

      {/* Base - Below the column */}
      <div
        style={{
          marginTop: '8px',
          marginLeft: '25px',
          width: panelWidth * 1.6,
          height: 12,
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          border: '1.5px solid #E17924',
          borderRadius: '3px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
        }}
      />
    </motion.div>
  )
}

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
        <span className="text-lg font-bold text-white">{title}</span>
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

        {/* TRI-HELIX */}
        <MobileProductCard
          productId="trihelix"
          title="TRI-HELIX"
          subtitle="Panoramic Display"
          gradient="from-yellow-400 to-amber-500"
          bgGradient="linear-gradient(135deg, rgba(254,204,0,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(254,204,0,0.2)"
          height={250}
          onAnimate={() => handleAnimate('trihelix')}
          isActive={activeCard === 'trihelix'}
        >
          <MobileTriHelixCard isActive={activeCard === 'trihelix'} onTap={() => handleAnimate('trihelix')} />
        </MobileProductCard>

        {/* HRMS */}
        <MobileProductCard
          productId="hrms"
          title="HRMS"
          subtitle="HR Management System"
          gradient="from-orange-500 to-amber-400"
          bgGradient="linear-gradient(135deg, rgba(239,145,69,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(239,145,69,0.2)"
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
          gradient="from-amber-500 to-orange-400"
          bgGradient="linear-gradient(135deg, rgba(245,166,35,0.1) 0%, rgba(0,0,0,0.8) 100%)"
          borderColor="rgba(245,166,35,0.2)"
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
                  <div key={rowIndex} style={{ width: 120, height: 100, transform: `translateY(${offsets[rowIndex] * 50}px)`, transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)', background: 'linear-gradient(135deg, rgba(245,166,35,0.6) 0%, rgba(239,145,69,0.7) 50%, rgba(186,86,23,0.5) 100%)', borderRadius: '4px', border: '1px solid rgba(245,166,35,0.5)', boxShadow: '0 0 25px rgba(245,166,35,0.5), inset 0 0 30px rgba(245,166,35,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.8) 0%, transparent 70%)' }} />
                  </div>
                ))}
              </div>
            )
          })}
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2" style={{ width: '90%', height: '20px', background: 'linear-gradient(180deg, #2a2a40 0%, #1a1a2e 100%)', borderRadius: '0 0 8px 8px' }} />
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
  // Letters for "KINETIC" (31-37)
  { type: 'text', value: 'K', bg: '#E17924', color: '#fff' },
  { type: 'text', value: 'I', bg: '#D97706', color: '#fff' },
  { type: 'text', value: 'N', bg: '#B45309', color: '#fff' },
  { type: 'text', value: 'E', bg: '#F59E0B', color: '#fff' },
  { type: 'text', value: 'T', bg: '#FBBF24', color: '#fff' },
  { type: 'text', value: 'I', bg: '#E17924', color: '#fff' },
  { type: 'text', value: 'C', bg: '#D97706', color: '#fff' },
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
  // Pattern 4: KINETIC displayed
  [
    [10, 31, 32, 33, 34, 35, 36, 37],
    [0, 10, 10, 10, 10, 10, 10, 1],
    [10, 10, 10, 10, 10, 10, 10, 10],
    [2, 10, 18, 19, 20, 21, 10, 3],
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
          }, 250)
        }
      }, 280) // 280ms per flip - faster cascade

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
          transition: 'transform 0.25s ease-out',
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
                    background: 'linear-gradient(135deg, rgba(245,166,35,0.5) 0%, rgba(239,145,69,0.6) 50%, rgba(186,86,23,0.4) 100%)',
                    borderRadius: '3px',
                    border: '1px solid rgba(245,166,35,0.4)',
                    boxShadow: '0 0 15px rgba(245,166,35,0.3), inset 0 0 15px rgba(245,166,35,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.7) 0%, transparent 70%)' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Product descriptions for the left side
const productDescriptions: Record<string, { tagline: string; description: string; features: string[] }> = {
  triblock: {
    tagline: "Transform Any Surface",
    description: "Revolutionary pixel wall technology that brings static surfaces to life with dynamic, responsive displays.",
    features: ["360° Rotation", "Interactive Touch", "Modular Design"],
  },
  flap: {
    tagline: "Retro Meets Modern",
    description: "Classic split-flap aesthetics reimagined with cutting-edge mechanics for mesmerizing visual storytelling.",
    features: ["Multi-layer Flip", "Wave Patterns", "Custom Content"],
  },
  trihelix: {
    tagline: "Unfold The Future",
    description: "Triangular prism towers that dramatically unfold into panoramic LED walls, creating breathtaking reveals.",
    features: ["Unfolding Panels", "LED Displays", "Stacked Layers"],
  },
  hrms: {
    tagline: "Intelligent Movement",
    description: "Synchronized pillar systems that create stunning 3D kinetic sculptures for corporate and retail spaces.",
    features: ["3D Rotation", "Pillar Movement", "Brand Integration"],
  },
  matrix: {
    tagline: "Fluid Motion Displays",
    description: "Wave-motion LED panels that create hypnotic patterns, perfect for immersive environments.",
    features: ["Wave Motion", "Color Sync", "Ambient Sensing"],
  },
}

// Animation variants for smooth transitions (from night commit)
const contentVariants = {
  enter: (d: number) => ({ y: d > 0 ? 80 : -80, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: d < 0 ? 80 : -80, opacity: 0 }),
}

const visualVariants = {
  enter: (d: number) => ({ scale: 0.85, opacity: 0, rotateY: d > 0 ? 20 : -20 }),
  center: { scale: 1, opacity: 1, rotateY: 0 },
  exit: (d: number) => ({ scale: 0.85, opacity: 0, rotateY: d < 0 ? 20 : -20 }),
}

// Consistent visual container size target: ~550px width, ~380px height
const VISUAL_ROWS = 10
const VISUAL_COLS = 14

// Large-scale visuals for scroll sections
function LargeTriblockVisual() {
  const [blocks] = useState(() => generateTriblocks(VISUAL_ROWS, VISUAL_COLS))
  const [activatedBlocks, setActivatedBlocks] = useState<Map<string, number>>(new Map())
  const gridRef = useRef<HTMLDivElement>(null)
  const blockSize = 36
  const gap = 4

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!gridRef.current) return
    const rect = gridRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    const maxRadius = 120
    const newActivated = new Map<string, number>()
    const centerCol = Math.floor(mouseX / (blockSize + gap))
    const centerRow = Math.floor(mouseY / (blockSize + gap))
    const checkRadius = Math.ceil(maxRadius / blockSize) + 1
    for (let row = Math.max(0, centerRow - checkRadius); row < Math.min(VISUAL_ROWS, centerRow + checkRadius + 1); row++) {
      for (let col = Math.max(0, centerCol - checkRadius); col < Math.min(VISUAL_COLS, centerCol + checkRadius + 1); col++) {
        const blockCenterX = col * (blockSize + gap) + blockSize / 2
        const blockCenterY = row * (blockSize + gap) + blockSize / 2
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
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setActivatedBlocks(new Map())}
    >
      <div ref={gridRef} style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-12deg) rotateY(18deg)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${VISUAL_COLS}, ${blockSize}px)`, gap: `${gap}px` }}>
          {blocks.map((block) => {
            const intensity = activatedBlocks.get(block.id) || 0
            return (
              <div
                key={block.id}
                style={{
                  width: blockSize,
                  height: blockSize,
                  background: `linear-gradient(145deg, ${adjustColor(block.colors.face1, 35)} 0%, ${block.colors.face1} 50%, ${adjustColor(block.colors.face1, -20)} 100%)`,
                  borderRadius: '3px',
                  transform: `translateY(${intensity > 0.1 ? -5 : 0}px)`,
                  transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                  boxShadow: intensity > 0.1
                    ? `0 8px 20px rgba(0,0,0,0.5), 0 0 20px rgba(225,121,36,${intensity * 0.6})`
                    : '0 2px 6px rgba(0,0,0,0.4), inset 0 1px 2px rgba(255,255,255,0.2)',
                }}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

function LargeFlapVisual() {
  const rows = 8
  const cols = 14
  const blockSize = 38
  const gap = 4
  const [animationCycle, setAnimationCycle] = useState(0)
  const [patternIndex, setPatternIndex] = useState(0)
  const [waveDirection, setWaveDirection] = useState(0)
  const isHoveringRef = useRef(false)

  // Sequential wave patterns - each block waits for previous to finish
  // Each block takes ~600ms to flip, so delay by 80ms creates cascading effect
  const getWaveDelay = useCallback((row: number, col: number, direction: number) => {
    const delayPerBlock = 40 // Small delay between blocks for smooth cascade
    switch (direction % 6) {
      case 0: return (row + col) * delayPerBlock // Top-left to bottom-right diagonal
      case 1: return ((rows - 1 - row) + (cols - 1 - col)) * delayPerBlock // Bottom-right to top-left
      case 2: return col * delayPerBlock // Left to right (column by column)
      case 3: return (cols - 1 - col) * delayPerBlock // Right to left
      case 4: return row * delayPerBlock * 2 // Top to bottom (row by row, slower)
      case 5: return (rows - 1 - row) * delayPerBlock * 2 // Bottom to top
      default: return 0
    }
  }, [rows, cols])

  // Run animation loop while hovering
  const runAnimation = useCallback(() => {
    if (!isHoveringRef.current) return

    setAnimationCycle(prev => prev + 1)
    setPatternIndex(prev => (prev + 1) % SETTLED_PATTERNS.length)
    setWaveDirection(prev => prev + 1)

    // Loop again after animation completes (around 4 seconds for all blocks to flip)
    setTimeout(() => {
      if (isHoveringRef.current) {
        runAnimation()
      }
    }, 5000)
  }, [])

  const handleHover = useCallback(() => {
    if (isHoveringRef.current) return
    isHoveringRef.current = true
    runAnimation()
  }, [runAnimation])

  const handleHoverEnd = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  const getExtendedContent = (row: number, col: number) => {
    const basePattern = SETTLED_PATTERNS[patternIndex]
    const baseRow = row % 5
    const baseCol = col % 8
    return basePattern[baseRow]?.[baseCol] ?? 10
  }

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      <div style={{
        padding: '0',
        transform: 'rotateX(8deg)',
        transformStyle: 'preserve-3d'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${blockSize}px)`, gap: `${gap}px` }}>
          {Array.from({ length: rows * cols }).map((_, index) => {
            const row = Math.floor(index / cols)
            const col = index % cols
            const finalContent = getExtendedContent(row, col)
            return (
              <BentoFlapBlock
                key={`${row}-${col}-${animationCycle}`}
                delay={getWaveDelay(row, col, waveDirection)}
                finalContent={finalContent}
                flipCount={2}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

// TRI-HELIX: Triangular LED column - wings open, then 360 rotation, base stays fixed
function LargeTriHelixVisual() {
  const [wingAngle, setWingAngle] = useState(0)
  const [layerRotations, setLayerRotations] = useState<number[]>([0, 0, 0, 0, 0, 0])
  const [isAnimating, setIsAnimating] = useState(false)
  const [rotationCycle, setRotationCycle] = useState(0)
  const [contentPhase, setContentPhase] = useState(0) // 0: closed, 1: open, 2: rotating
  const layers = 6
  const layerHeight = 58
  const layerGap = 5
  const panelWidth = 145 // Wider panels

  // Content for each layer's LED screen (changes with animation phase)
  const layerContent = [
    { closed: 'UNFOLD', open: 'YOUR', rotating: 'TRI' },
    { closed: 'THE', open: 'BRAND', rotating: 'HELIX' },
    { closed: 'FUTURE', open: 'STORY', rotating: 'LED' },
    { closed: 'OF', open: 'IN', rotating: 'DISPLAY' },
    { closed: 'DISPLAY', open: '3D', rotating: 'SYSTEM' },
    { closed: 'TECH', open: 'SPACE', rotating: '360°' },
  ]

  // Track if still hovering for loop
  const isHoveringRef = useRef(false)

  // Animation sequence - loops while hovering (open wings -> close wings -> rotate 180°)
  const runAnimation = useCallback(() => {
    if (!isHoveringRef.current) return

    setIsAnimating(true)

    // Phase 1: Open wings
    setWingAngle(120)
    setContentPhase(1)

    // Phase 2: Close wings
    setTimeout(() => {
      if (!isHoveringRef.current) return
      setWingAngle(0)
      setContentPhase(2)
    }, 2500)

    // Phase 3: Rotate all layers 180° (staggered timing via CSS transition delay)
    setTimeout(() => {
      if (!isHoveringRef.current) return
      setLayerRotations([180, 180, 180, 180, 180, 180])
    }, 3500)

    // Phase 4: Reset rotations and restart
    setTimeout(() => {
      if (!isHoveringRef.current) return
      setLayerRotations([0, 0, 0, 0, 0, 0])
      setContentPhase(0)
    }, 5500)

    // Phase 5: Loop again if still hovering
    setTimeout(() => {
      setIsAnimating(false)
      if (isHoveringRef.current) {
        runAnimation()
      }
    }, 7000)
  }, [])

  const handleHover = useCallback(() => {
    if (isAnimating) return
    isHoveringRef.current = true
    runAnimation()
  }, [isAnimating, runAnimation])

  const handleHoverEnd = useCallback(() => {
    isHoveringRef.current = false
  }, [])

  const totalHeight = layers * (layerHeight + layerGap)

  return (
    <div
      className="relative cursor-pointer flex items-center justify-center"
      style={{ perspective: '1200px', height: totalHeight + 120 }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      {/* Column container - faces straight front */}
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform: 'rotateX(8deg)',
        }}
      >
        {/* Triangular Column Structure */}
        <div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            width: panelWidth,
            height: totalHeight,
          }}
        >
          {Array.from({ length: layers }).map((_, layerIndex) => {
            const yPos = layerIndex * (layerHeight + layerGap)
            // Each layer has its own rotation - home position is straight (0)
            const layerRotation = layerRotations[layerIndex]
            // Get content based on current phase
            const content = layerContent[layerIndex]
            const displayText = contentPhase === 0 ? content.closed : contentPhase === 1 ? content.open : content.rotating

            return (
              <div
                key={layerIndex}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transformStyle: 'preserve-3d',
                  transform: `translateX(-50%) translateY(${yPos}px) rotateY(${layerRotation}deg)`,
                  transition: `transform 2.5s ease-in-out ${layerIndex * 0.15}s`,
                  width: panelWidth,
                  height: layerHeight,
                }}
              >
                {/* Front Panel (Center) */}
                <div
                  style={{
                    position: 'absolute',
                    width: panelWidth,
                    height: layerHeight,
                    transform: 'translateZ(35px)',
                    background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                    border: '2px solid #E17924',
                    borderRadius: '4px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {/* LED screen with dynamic content */}
                  <div
                    style={{
                      width: '88%',
                      height: '75%',
                      background: '#0a0a0a',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    <span
                      style={{
                        color: '#E17924',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        letterSpacing: '2px',
                        transition: 'opacity 0.5s ease-in-out',
                      }}
                    >
                      {displayText}
                    </span>
                  </div>
                </div>

                {/* Left Wing Panel */}
                <div
                  style={{
                    position: 'absolute',
                    width: panelWidth,
                    height: layerHeight,
                    transformOrigin: 'right center',
                    transform: `translateZ(35px) translateX(-${panelWidth}px) rotateY(${-120 + wingAngle}deg)`,
                    transition: 'transform 2.5s ease-in-out',
                    background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                    border: '2px solid #BA5617',
                    borderRadius: '4px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '88%', height: '75%', background: '#0a0a0a', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span style={{ color: '#E17924', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {['KINETIC', 'DYNAMIC', 'MOTION', 'VISUAL', 'IMPACT', 'ENGAGE'][layerIndex]}
                    </span>
                  </div>
                </div>

                {/* Right Wing Panel */}
                <div
                  style={{
                    position: 'absolute',
                    width: panelWidth,
                    height: layerHeight,
                    transformOrigin: 'left center',
                    transform: `translateZ(35px) translateX(${panelWidth}px) rotateY(${120 - wingAngle}deg)`,
                    transition: 'transform 2.5s ease-in-out',
                    background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%)',
                    border: '2px solid #BA5617',
                    borderRadius: '4px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: '88%', height: '75%', background: '#0a0a0a', borderRadius: '3px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    <span style={{ color: '#E17924', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px' }}>
                      {['SCREENS', 'DISPLAY', 'CONTENT', 'STORIES', 'BRANDS', 'CROWDS'][layerIndex]}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Base platform - FIXED, does not rotate */}
      <div
        className="absolute"
        style={{
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%) rotateX(8deg)',
          width: 200,
          height: 30,
          background: 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)',
          border: '2px solid #E17924',
          borderRadius: '5px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.7)',
        }}
      />
    </div>
  )
}

function LargeHRMSVisual() {
  const [rotationCycle, setRotationCycle] = useState(0)
  const [movementPhase, setMovementPhase] = useState(0)
  const boxWidth = 150
  const boxHeight = 55
  const pillarGap = 12

  useEffect(() => {
    setRotationCycle(1)
    setMovementPhase(1)
    const r = setInterval(() => setRotationCycle(prev => prev + 1), 2600)
    const m = setInterval(() => setMovementPhase(prev => (prev % 2) + 1), 2200)
    return () => { clearInterval(r); clearInterval(m) }
  }, [])

  const getRotation = (pillarIndex: number, boxIndex: number, cycle: number) => {
    if (cycle === 0) return [0, 25, -30, 35, -25][boxIndex] || 0
    return (cycle % 2 === 0 ? 180 : 0) + ((boxIndex * 5 + pillarIndex * 3) % 8 - 4)
  }

  const getOffset = (pillarIndex: number) => {
    if (movementPhase === 0) return 0
    if (pillarIndex === 0) return movementPhase === 1 ? -80 : 0
    if (pillarIndex === 2) return movementPhase === 1 ? 80 : 0
    return 0
  }

  return (
    <div className="relative" style={{ perspective: '1000px' }}>
      <div style={{ transform: 'rotateX(5deg)', transformStyle: 'preserve-3d' }}>
        <div className="flex items-end justify-center" style={{ gap: `${pillarGap}px` }}>
          {[0, 1, 2].map((pillarIndex) => (
            <div
              key={pillarIndex}
              className="flex flex-col-reverse items-center"
              style={{
                perspective: '800px',
                transformStyle: 'preserve-3d',
                transform: `translateX(${getOffset(pillarIndex)}px)`,
                transition: 'transform 1.5s ease-in-out',
              }}
            >
              {HRMS_BOXES.map((box, boxIndex) => (
                <div
                  key={box.id}
                  style={{
                    marginTop: boxIndex === 0 ? 0 : -2,
                    zIndex: 5 - boxIndex,
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${getRotation(pillarIndex, boxIndex, rotationCycle)}deg)`,
                    transition: 'transform 2s ease-in-out',
                  }}
                >
                  <div style={{ width: boxWidth, height: boxHeight, transformStyle: 'preserve-3d' }}>
                    <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(12px)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 18px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
                      <span className="font-black text-[11px] tracking-wider" style={{ color: HRMS_PRIMARY }}>{box.text}</span>
                    </div>
                    <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(-12px) rotateY(180deg)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 18px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center', backfaceVisibility: 'hidden' }}>
                      <span className="font-black text-[11px]" style={{ color: HRMS_PRIMARY }}>{box.backText}</span>
                    </div>
                    <div className="absolute top-0 bottom-0" style={{ left: 0, width: '24px', transform: 'rotateY(-90deg)', transformOrigin: 'left center', background: `linear-gradient(to right, ${HRMS_DARK}, ${HRMS_SECONDARY})`, backfaceVisibility: 'hidden' }} />
                    <div className="absolute top-0 bottom-0" style={{ right: 0, width: '24px', transform: 'rotateY(90deg)', transformOrigin: 'right center', background: `linear-gradient(to left, ${HRMS_DARK}, ${HRMS_SECONDARY})`, backfaceVisibility: 'hidden' }} />
                    <div className="absolute left-0 right-0" style={{ top: 0, height: '24px', transform: 'rotateX(90deg)', transformOrigin: 'top center', background: HRMS_PRIMARY, backfaceVisibility: 'hidden' }} />
                    <div className="absolute left-0 right-0" style={{ bottom: 0, height: '24px', transform: 'rotateX(-90deg)', transformOrigin: 'bottom center', background: HRMS_DARK, backfaceVisibility: 'hidden' }} />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-4 mx-auto h-[35px]" style={{ width: `${boxWidth * 3 + pillarGap * 2 + 40}px`, background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)', border: `2px solid ${HRMS_PRIMARY}`, borderRadius: '6px', boxShadow: `0 0 30px ${HRMS_GLOW}` }} />
      </div>
    </div>
  )
}

function LargeMatrixVisual() {
  const [pattern, setPattern] = useState(0)
  const isHoveringRef = useRef(false)

  const cols = 8
  const rows = 4
  const cellWidth = 70
  const cellHeight = 55
  const colGap = 4
  const rowGap = 4

  // Wave patterns - Y offsets for each column (screens slide up/down)
  const patterns = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [-25, -15, 0, 15, 25, 15, 0, -15],
    [20, 10, -5, -15, -15, -5, 10, 20],
    [-20, 15, -20, 15, -20, 15, -20, 15],
    [15, 0, -15, -25, -15, 0, 15, 25],
  ]

  // Brand orange color from palette #E17924
  const colors = {
    bg: 'rgba(225,121,36,0.9)',
    glow: 'rgba(225,121,36,0.5)',
    dark: 'rgba(108,42,0,0.95)',
    dot: 'rgba(255,255,255,0.9)'
  }

  // Cycle through patterns while hovering
  const cycleAnimation = useCallback(() => {
    if (!isHoveringRef.current) return

    setPattern(prev => (prev + 1) % patterns.length)

    setTimeout(() => {
      if (isHoveringRef.current) {
        cycleAnimation()
      }
    }, 2000)
  }, [])

  const handleHover = () => {
    isHoveringRef.current = true
    cycleAnimation()
  }

  const handleHoverEnd = () => {
    isHoveringRef.current = false
    setPattern(0)
  }

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverEnd}
    >
      <div style={{ transformStyle: 'preserve-3d', transform: 'rotateX(10deg) rotateY(-8deg)' }}>
        {/* Back frame */}
        <div style={{
          padding: '20px',
          background: 'linear-gradient(180deg, #2a2a35 0%, #1a1a22 100%)',
          borderRadius: '8px',
          border: '3px solid #3a3a45',
          boxShadow: '0 30px 60px rgba(0,0,0,0.7)'
        }}>
          <div style={{ display: 'flex', gap: `${colGap}px` }}>
            {Array.from({ length: cols }).map((_, colIndex) => (
              <div key={colIndex} className="flex flex-col" style={{ gap: `${rowGap}px` }}>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={{
                      width: cellWidth,
                      height: cellHeight,
                      transform: `translateY(${patterns[pattern][colIndex]}px)`,
                      transition: 'transform 1.8s ease-in-out',
                      background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.dark} 100%)`,
                      borderRadius: '4px',
                      border: '2px solid rgba(186,86,23,0.6)',
                      boxShadow: `0 4px 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Glow dot */}
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${colors.dot} 0%, rgba(255,255,255,0.3) 50%, transparent 70%)`,
                      boxShadow: `0 0 10px rgba(255,255,255,0.5)`,
                    }} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Desktop Scroll-Based Showcase - Sticky with AnimatePresence swap
function DesktopShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const displayedIndexRef = useRef(0)
  const targetIndexRef = useRef(0)
  const animationFrameRef = useRef<number | null>(null)

  // Animate step by step using requestAnimationFrame
  useEffect(() => {
    let lastStepTime = 0
    const stepInterval = 350 // ms between each product step

    const animate = (timestamp: number) => {
      const current = displayedIndexRef.current
      const target = targetIndexRef.current

      if (current !== target) {
        // Only step if enough time has passed
        if (timestamp - lastStepTime >= stepInterval) {
          const step = target > current ? 1 : -1
          const nextIndex = current + step

          displayedIndexRef.current = nextIndex
          setDirection(step)
          setActiveIndex(nextIndex)
          lastStepTime = timestamp
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const scrollableHeight = rect.height - window.innerHeight
      const scrolled = -rect.top

      // Calculate which product section we're in
      const sectionHeight = scrollableHeight / products.length
      const rawIndex = scrolled / sectionHeight

      // Clamp to valid range
      const newTargetIndex = Math.max(0, Math.min(products.length - 1, Math.round(rawIndex)))

      // Just update the target - the animation loop will handle stepping
      targetIndexRef.current = newTargetIndex
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const product = products[activeIndex]
  const desc = productDescriptions[product.id]

  const renderVisual = () => {
    switch (product.type) {
      case 'triblock': return <LargeTriblockVisual />
      case 'flap': return <LargeFlapVisual />
      case 'trihelix': return <LargeTriHelixVisual />
      case 'hrms': return <LargeHRMSVisual />
      case 'matrix': return <LargeMatrixVisual />
      default: return null
    }
  }

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: `${products.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />

        {/* Animated background glows */}
        <motion.div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20"
          animate={{ background: `radial-gradient(circle, ${product.accentColor}, transparent)` }}
          transition={{ duration: 0.8 }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15"
          animate={{ background: `radial-gradient(circle, ${product.accentColor}, transparent)` }}
          transition={{ duration: 0.8 }}
        />

        {/* Content - Full Width Split Layout */}
        <div className="relative h-full flex w-full">
          {/* Left Side - Product Info (40%) */}
          <div className="w-[40%] h-full flex flex-col justify-center px-12 lg:px-20 relative z-10">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={contentVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full"
                style={{ fontFamily: 'Helvetica, "Polysans", Arial, sans-serif' }}
              >
                {/* Accent line */}
                <div className="h-1 w-16 rounded-full mb-6" style={{ background: product.accentColor }} />

                {/* Title */}
                <h2 className="text-5xl lg:text-6xl font-bold text-white mb-2">
                  {product.title}
                </h2>
                <p className="text-lg text-white/60 font-medium mb-4 uppercase tracking-wider">{product.subtitle}</p>

                {/* Tagline */}
                <p className="text-xl lg:text-2xl text-white font-light mb-3 leading-snug">{desc.tagline}</p>

                {/* Description */}
                <p className="text-sm lg:text-base text-white/50 leading-relaxed mb-6 max-w-md">
                  {desc.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {desc.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wide bg-white/10 border border-white/20 text-white/80"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href="#booking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold hover:scale-105 transition-transform shadow-lg"
                >
                  <span>Explore Product</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Product Visual (60%) */}
          <div className="w-[60%] h-full flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={product.id}
                custom={direction}
                variants={visualVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute inset-0 flex items-center justify-center"
                style={{ perspective: '1000px' }}
              >
                {renderVisual()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
          animate={{ opacity: activeIndex === products.length - 1 ? 0 : 1 }}
        >
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1"
          >
            <div className="w-1 h-2 rounded-full bg-white/40" />
          </motion.div>
        </motion.div>
      </div>
    </div>
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

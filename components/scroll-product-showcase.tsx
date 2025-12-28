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
const MOBILE_FLAP_ROWS = 5
const MOBILE_FLAP_COLS = 8
const MOBILE_MATRIX_COLS = 5

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
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ transform: 'rotateX(-12deg) rotateY(15deg)', transformStyle: 'preserve-3d' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MOBILE_TRIBLOCK_COLS}, 28px)`, gap: '2px' }}>
          {blocks.map((block) => {
            const intensity = isActive ? getBlockIntensity(block.row, block.col) : 0
            return (
              <motion.div
                key={block.id}
                animate={{ y: intensity > 0.1 ? -6 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  width: 28,
                  height: 28,
                  background: `linear-gradient(145deg, ${adjustColor(block.colors.face1, 30)} 0%, ${block.colors.face1} 50%, ${adjustColor(block.colors.face1, -20)} 100%)`,
                  borderRadius: '3px',
                  boxShadow: intensity > 0.1
                    ? `0 8px 16px rgba(0,0,0,0.4), 0 0 20px rgba(225,121,36,${intensity * 0.6})`
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

// Mobile Flap Visual - Tap to flip
function MobileFlapCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [blocks] = useState(() => generateFlapBlocks(MOBILE_FLAP_ROWS, MOBILE_FLAP_COLS))
  const [flipPattern, setFlipPattern] = useState(0)

  useEffect(() => {
    if (isActive) {
      setFlipPattern(prev => prev + 1)
    }
  }, [isActive])

  const getDelay = (row: number, col: number) => {
    const pattern = flipPattern % 4
    switch (pattern) {
      case 0: return (row + col) * 60
      case 1: return Math.sqrt(Math.pow(row - MOBILE_FLAP_ROWS / 2, 2) + Math.pow(col - MOBILE_FLAP_COLS / 2, 2)) * 80
      case 2: return ((MOBILE_FLAP_ROWS - 1 - row) + (MOBILE_FLAP_COLS - 1 - col)) * 60
      case 3: return row * 100 + (col % 3) * 30
      default: return 0
    }
  }

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div
        style={{
          padding: '12px',
          background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${MOBILE_FLAP_COLS}, 32px)`, gap: '3px' }}>
          {blocks.map((block) => (
            <motion.div
              key={`${block.id}-${flipPattern}`}
              initial={{ rotateY: 0 }}
              animate={isActive ? { rotateY: [0, 180, 0] } : {}}
              transition={{ duration: 0.6, delay: getDelay(block.row, block.col) / 1000 }}
              style={{
                width: 32,
                height: 40,
                background: `linear-gradient(135deg, ${adjustColor(block.baseColor, 25)} 0%, ${block.baseColor} 50%, ${adjustColor(block.baseColor, -20)} 100%)`,
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}
            />
          ))}
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[280px] h-[50px]" style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.4) 0%, transparent 70%)', filter: 'blur(15px)' }} />
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

// Mobile HRMS Visual - All 3 pillars visible
function MobileHRMSCard({ isActive, onTap }: { isActive: boolean; onTap: () => void }) {
  const [rotationPhase, setRotationPhase] = useState(0)

  useEffect(() => {
    if (isActive) {
      setRotationPhase(prev => prev + 1)
    }
  }, [isActive])

  const getRotation = (pillarIndex: number, boxIndex: number) => {
    if (rotationPhase === 0) return 0
    const base = rotationPhase % 2 === 0 ? 180 : 0
    return base + (pillarIndex * 15) + (boxIndex * 10)
  }

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-end justify-center gap-3">
        {[0, 1, 2].map((pillarIndex) => (
          <div key={pillarIndex} className="flex flex-col-reverse items-center gap-0.5">
            {HRMS_BOXES.slice(0, 4).map((box, boxIndex) => (
              <motion.div
                key={box.id}
                animate={isActive ? { rotateY: getRotation(pillarIndex, boxIndex) } : {}}
                transition={{ duration: 1.5, delay: pillarIndex * 0.1 + boxIndex * 0.05 }}
                style={{
                  width: 70,
                  height: 28,
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
                  border: `1.5px solid ${HRMS_PRIMARY}`,
                  borderRadius: '3px',
                  boxShadow: `0 0 10px ${HRMS_GLOW}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transformStyle: 'preserve-3d',
                }}
              >
                <span style={{ fontSize: 8, fontWeight: 800, color: HRMS_PRIMARY, letterSpacing: '0.5px' }}>{box.text}</span>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      {/* Base */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        style={{
          width: 260,
          height: 20,
          background: 'linear-gradient(180deg, #2a2a3a 0%, #1a1a2a 100%)',
          border: `1.5px solid ${HRMS_PRIMARY}`,
          borderRadius: '4px',
          boxShadow: `0 0 15px ${HRMS_GLOW}`,
        }}
      />
      {/* Glow */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[280px] h-[60px]" style={{ background: `radial-gradient(ellipse, ${HRMS_GLOW} 0%, transparent 70%)`, filter: 'blur(20px)' }} />
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-white/40 uppercase tracking-wider"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Tap to rotate
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
      className="relative w-full h-full flex items-center justify-center cursor-pointer"
      onClick={onTap}
      whileTap={{ scale: 0.98 }}
    >
      <div style={{ transform: 'rotateX(5deg) rotateY(-8deg)' }}>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            padding: '20px 16px',
            background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
            borderRadius: '8px',
            border: '1.5px solid #2a2a40',
          }}
        >
          {Array.from({ length: MOBILE_MATRIX_COLS }).map((_, colIndex) => (
            <div key={colIndex} className="flex flex-col gap-2">
              {[0, 1, 2].map((rowIndex) => (
                <motion.div
                  key={rowIndex}
                  animate={isActive ? { y: getOffset(colIndex) } : { y: 0 }}
                  transition={{ duration: 0.8, delay: colIndex * 0.05 }}
                  style={{
                    width: 50,
                    height: 45,
                    background: 'linear-gradient(135deg, rgba(6,182,212,0.6) 0%, rgba(8,145,178,0.7) 50%, rgba(14,116,144,0.5) 100%)',
                    borderRadius: '3px',
                    border: '1px solid rgba(6,182,212,0.5)',
                    boxShadow: '0 0 15px rgba(6,182,212,0.4), inset 0 0 20px rgba(6,182,212,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)' }} />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Glow */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[300px] h-[50px]" style={{ background: 'radial-gradient(ellipse, rgba(6,182,212,0.4) 0%, transparent 70%)', filter: 'blur(15px)' }} />
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
function MobileShowcase() {
  const [activeCard, setActiveCard] = useState<string | null>(null)
  const [tapCount, setTapCount] = useState<Record<string, number>>({})

  const handleTap = (productId: string) => {
    setActiveCard(productId)
    setTapCount(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }))
    // Reset after animation
    setTimeout(() => setActiveCard(null), 1500)
  }

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
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(225,121,36,0.1) 0%, rgba(0,0,0,0.8) 100%)',
            border: '1px solid rgba(225,121,36,0.2)',
            height: 300,
          }}
          whileTap={{ scale: 0.99 }}
        >
          <MobileTriblockCard isActive={activeCard === 'triblock'} onTap={() => handleTap('triblock')} />
          <div className="absolute top-3 left-3">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">TRIBLOCK</span>
            <p className="text-[10px] text-white/50">Pixel Walls</p>
          </div>
        </motion.div>

        {/* Flap - Full width */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(0,0,0,0.8) 100%)',
            border: '1px solid rgba(245,158,11,0.2)',
            height: 320,
          }}
          whileTap={{ scale: 0.99 }}
        >
          <MobileFlapCard isActive={activeCard === 'flap'} onTap={() => handleTap('flap')} />
          <div className="absolute top-3 left-3">
            <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">FLAP</span>
            <p className="text-[10px] text-white/50">Split Flap Display</p>
          </div>
        </motion.div>

        {/* HRMS - Full width */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(0,0,0,0.8) 100%)',
            border: '1px solid rgba(139,92,246,0.2)',
            height: 280,
          }}
          whileTap={{ scale: 0.99 }}
        >
          <MobileHRMSCard isActive={activeCard === 'hrms'} onTap={() => handleTap('hrms')} />
          <div className="absolute top-3 left-3">
            <span className="text-lg font-bold bg-gradient-to-r from-violet-500 to-purple-400 bg-clip-text text-transparent">HRMS</span>
            <p className="text-[10px] text-white/50">HR Management System</p>
          </div>
        </motion.div>

        {/* Matrix - Full width */}
        <motion.div
          className="relative rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0.8) 100%)',
            border: '1px solid rgba(6,182,212,0.2)',
            height: 300,
          }}
          whileTap={{ scale: 0.99 }}
        >
          <MobileMatrixCard isActive={activeCard === 'matrix'} onTap={() => handleTap('matrix')} />
          <div className="absolute top-3 left-3">
            <span className="text-lg font-bold bg-gradient-to-r from-cyan-500 to-teal-400 bg-clip-text text-transparent">MATRIX</span>
            <p className="text-[10px] text-white/50">Kinetic Screens</p>
          </div>
        </motion.div>
      </div>

      {/* CTA */}
      <div className="text-center mt-8">
        <Link
          href="#booking"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white text-sm font-semibold"
        >
          <span>Explore All Products</span>
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
            <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(10px)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 15px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-black text-[13px] tracking-wider" style={{ color: HRMS_PRIMARY }}>{box.text}</span>
            </div>
            <div className="absolute inset-0 rounded" style={{ transform: 'translateZ(-12px) rotateY(180deg)', background: 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)', border: `2px solid ${HRMS_PRIMARY}`, boxShadow: `0 0 15px ${HRMS_GLOW}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="font-black text-[14px]" style={{ color: HRMS_PRIMARY }}>{box.backText}</span>
            </div>
            <div className="absolute top-0 bottom-0" style={{ left: 0, width: '24px', transform: 'rotateY(-90deg)', transformOrigin: 'left center', background: `linear-gradient(to right, ${HRMS_DARK}, ${HRMS_SECONDARY})` }} />
            <div className="absolute top-0 bottom-0" style={{ right: 0, width: '24px', transform: 'rotateY(90deg)', transformOrigin: 'right center', background: `linear-gradient(to left, ${HRMS_DARK}, ${HRMS_SECONDARY})` }} />
            <div className="absolute left-0 right-0" style={{ top: 0, height: '24px', transform: 'rotateX(90deg)', transformOrigin: 'top center', background: HRMS_PRIMARY }} />
            <div className="absolute left-0 right-0" style={{ bottom: 0, height: '24px', transform: 'rotateX(-90deg)', transformOrigin: 'bottom center', background: HRMS_DARK }} />
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

// Desktop animations
const contentVariants = {
  enter: (d: number) => ({ y: d > 0 ? 60 : -60, opacity: 0 }),
  center: { y: 0, opacity: 1 },
  exit: (d: number) => ({ y: d < 0 ? 60 : -60, opacity: 0 }),
}

const visualVariants = {
  enter: (d: number) => ({ scale: 0.8, opacity: 0, rotateY: d > 0 ? 15 : -15 }),
  center: { scale: 1, opacity: 1, rotateY: 0 },
  exit: (d: number) => ({ scale: 0.8, opacity: 0, rotateY: d < 0 ? 15 : -15 }),
}

// Desktop Showcase
function DesktopShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const prevIndexRef = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)))
      const newIndex = Math.min(Math.floor(progress * products.length), products.length - 1)
      if (newIndex !== prevIndexRef.current) {
        setDirection(newIndex > prevIndexRef.current ? 1 : -1)
        setActiveIndex(newIndex)
        prevIndexRef.current = newIndex
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const product = products[activeIndex]

  const renderVisual = () => {
    switch (product.type) {
      case 'triblock': return <TriblockVisual isActive={activeIndex === 0} />
      case 'flap': return <FlapVisual isActive={activeIndex === 1} />
      case 'hrms': return <HRMSVisual isActive={activeIndex === 2} />
      case 'matrix': return <MatrixVisual isActive={activeIndex === 3} />
      default: return null
    }
  }

  return (
    <div ref={containerRef} className="relative bg-black" style={{ height: `${products.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-neutral-900" />
        <motion.div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-20" animate={{ background: `radial-gradient(circle, ${product.accentColor}, transparent)` }} transition={{ duration: 0.8 }} />
        <motion.div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-15" animate={{ background: `radial-gradient(circle, ${product.accentColor}, transparent)` }} transition={{ duration: 0.8 }} />

        <div className="relative h-full grid lg:grid-cols-[1fr_1.5fr] gap-8 px-12 lg:px-20">
          {/* Content - Minimal */}
          <div className="flex flex-col justify-center items-start text-left relative z-10">
            <div className="flex gap-2 mb-6">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    const target = (idx / products.length) * (containerRef.current?.offsetHeight || 0 - window.innerHeight)
                    window.scrollTo({ top: target + (containerRef.current?.offsetTop || 0), behavior: 'smooth' })
                  }}
                  className={`h-2 rounded-full transition-all duration-500 ${idx === activeIndex ? 'w-8' : 'w-2'}`}
                  style={{ backgroundColor: idx === activeIndex ? product.accentColor : 'rgba(255,255,255,0.2)', boxShadow: idx === activeIndex ? `0 0 10px ${product.accentColor}` : 'none' }}
                />
              ))}
            </div>

            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={product.id} custom={direction} variants={contentVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.5 }} className="w-full">
                <h2 className={`text-5xl lg:text-7xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent mb-2`}>{product.title}</h2>
                <p className="text-xl text-white/50 font-medium mb-6">{product.subtitle}</p>
                <Link href="#booking" className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${product.gradient} text-white font-semibold hover:scale-105 transition-transform`}>
                  <span>Learn More</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Visual - Larger */}
          <div className="relative h-full flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div key={product.id} custom={direction} variants={visualVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6 }} className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1000px' }}>
                {renderVisual()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40" animate={{ opacity: activeIndex === products.length - 1 ? 0 : 1 }}>
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-5 h-8 rounded-full border-2 border-white/20 flex items-start justify-center p-1">
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

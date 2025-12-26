"use client"

import { useRef, useState, useEffect, useCallback, useMemo } from "react"
import { motion, useScroll } from "framer-motion"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

// Triblock colors - face1: Orange (front), face2: Silver (top - shows on hover), face3: not used
const TRIBLOCK_COLORS = [
  { face1: '#E17924', face2: '#C0C0C0', face3: '#A8A8A8' },
  { face1: '#BA5617', face2: '#B8B8B8', face3: '#A0A0A0' },
  { face1: '#D4650E', face2: '#CACACA', face3: '#B0B0B0' },
  { face1: '#F28C38', face2: '#D0D0D0', face3: '#B8B8B8' },
  { face1: '#994E1F', face2: '#BEBEBE', face3: '#A8A8A8' },
  { face1: '#E8943D', face2: '#C8C8C8', face3: '#B0B0B0' },
  { face1: '#FF8C42', face2: '#D4D4D4', face3: '#BCBCBC' },
]

// Flap colors - front and back faces
const FLAP_FRONT_COLORS = [
  '#E17924', '#BA5617', '#D4650E', '#F28C38', '#994E1F',
  '#E8943D', '#FF8C42', '#C96A1A', '#E07020', '#F5A623',
]

const FLAP_BACK_COLORS = [
  '#1A1A1A', '#252525', '#2A2A2A', '#1F1F1F', '#333333',
  '#0F0F0F', '#181818', '#222222', '#2D2D2D', '#151515',
]

// Matrix pillar configuration
const MATRIX_COLS = 6
const MATRIX_ROWS = 3

// Triblock configuration
const TRIBLOCK_ROWS = 12
const TRIBLOCK_COLS = 18

// Flap configuration
const FLAP_ROWS = 3
const FLAP_COLS = 5

// Generate original triblocks (for lift/tilt animation)
function generateTriblocks(rows: number, cols: number) {
  const blocks = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const colorSet = TRIBLOCK_COLORS[Math.floor(Math.random() * TRIBLOCK_COLORS.length)]
      blocks.push({
        id: `${row}-${col}`,
        row,
        col,
        colors: colorSet,
        delay: (row + col) * 0.01,
      })
    }
  }
  return blocks
}

// Generate flap blocks (for flip animation)
function generateFlapBlocks(rows: number, cols: number) {
  const blocks = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const frontColor = FLAP_FRONT_COLORS[Math.floor(Math.random() * FLAP_FRONT_COLORS.length)]
      const backColor = FLAP_BACK_COLORS[Math.floor(Math.random() * FLAP_BACK_COLORS.length)]
      // Calculate delay based on diagonal from bottom-left to top-right
      const diagonalIndex = (rows - 1 - row) + col
      blocks.push({
        id: `${row}-${col}`,
        row,
        col,
        frontColor,
        backColor,
        flipDelay: diagonalIndex * 0.05, // 50ms delay per diagonal
      })
    }
  }
  return blocks
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// Triblock component - 3D prism that rotates vertically (top to bottom) on hover
function TriPrismBlock({
  colors,
  delay,
  intensity,
}: {
  colors: { face1: string; face2: string; face3: string }
  delay: number
  intensity: number
}) {
  const size = 32

  // Full 90 degree rotation when intensity > 0.1 (fully show different color)
  const rotateX = intensity > 0.1 ? 90 : 0

  return (
    <div
      style={{
        width: size,
        height: size,
        perspective: '400px',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg)`,
          transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Front face - Color 1 (Orange) - default visible */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `linear-gradient(145deg,
              ${adjustColor(colors.face1, 35)} 0%,
              ${colors.face1} 40%,
              ${adjustColor(colors.face1, -25)} 100%)`,
            transform: `translateZ(${size / 2}px)`,
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.4),
              inset 0 -2px 4px rgba(0,0,0,0.2)
            `,
            borderRadius: '2px',
          }}
        />

        {/* Top face - Black/Dark - shows when rotated forward */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `linear-gradient(145deg,
              ${adjustColor(colors.face2, 15)} 0%,
              ${colors.face2} 40%,
              ${adjustColor(colors.face2, -10)} 100%)`,
            transform: `rotateX(-90deg) translateZ(${size / 2}px)`,
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.15),
              inset 0 -2px 4px rgba(0,0,0,0.4)
            `,
            borderRadius: '2px',
          }}
        />

        {/* Back face - Color 2 (Dark) */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `linear-gradient(145deg,
              ${adjustColor(colors.face2, 25)} 0%,
              ${colors.face2} 40%,
              ${adjustColor(colors.face2, -15)} 100%)`,
            transform: `rotateX(180deg) translateZ(${size / 2}px)`,
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.2),
              inset 0 -2px 4px rgba(0,0,0,0.3)
            `,
            borderRadius: '2px',
          }}
        />

        {/* Bottom face - Darker shade */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `linear-gradient(145deg,
              ${adjustColor(colors.face1, -40)} 0%,
              ${adjustColor(colors.face1, -60)} 100%)`,
            transform: `rotateX(90deg) translateZ(${size / 2}px)`,
            boxShadow: `
              inset 0 1px 2px rgba(255,255,255,0.1),
              inset 0 -2px 4px rgba(0,0,0,0.3)
            `,
            borderRadius: '2px',
          }}
        />

        {/* Left face */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `linear-gradient(145deg,
              ${adjustColor(colors.face1, -20)} 0%,
              ${adjustColor(colors.face1, -40)} 100%)`,
            transform: `rotateY(-90deg) translateZ(${size / 2}px)`,
            borderRadius: '2px',
          }}
        />

        {/* Right face */}
        <div
          style={{
            position: 'absolute',
            width: size,
            height: size,
            background: `linear-gradient(145deg,
              ${adjustColor(colors.face1, -30)} 0%,
              ${adjustColor(colors.face1, -50)} 100%)`,
            transform: `rotateY(90deg) translateZ(${size / 2}px)`,
            borderRadius: '2px',
          }}
        />
      </div>

      {/* Glow effect when active */}
      {intensity > 0.3 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: size * 2,
            height: size * 2,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(225,121,36,${intensity * 0.4}) 0%, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

// Flap block component - split-flap display animation
function FlapBlock({
  frontColor,
  backColor,
  flipDelay,
  isFlipped,
}: {
  frontColor: string
  backColor: string
  flipDelay: number
  isFlipped: boolean
}) {
  const width = 120
  const height = 160
  const halfHeight = height / 2

  // Top shows the NEW color (revealed when flap falls away)
  const topColor = isFlipped ? backColor : frontColor
  // Bottom stays OLD color - the flap landing will cover it
  const bottomColor = isFlipped ? frontColor : backColor
  // Flap front = OLD color (what was showing), back = NEW color (what will show)
  const flapFrontColor = isFlipped ? frontColor : backColor
  const flapBackColor = isFlipped ? backColor : frontColor

  return (
    <div
      style={{
        width: width,
        height: height,
        position: 'relative',
      }}
    >
      {/* Bottom half - stays OLD color, flap covers it with NEW */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: halfHeight,
          background: bottomColor,
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
        }}
      />

      {/* Top half - shows NEW color (revealed when flap falls away) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: halfHeight,
          background: topColor,
          boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
        }}
      />

      {/* Falling flap - always falls from top, key forces remount on flip change */}
      <div
        key={isFlipped ? 'flipped' : 'unflipped'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: halfHeight,
          transformOrigin: 'bottom center',
          animation: `flapFall 0.4s ease ${flipDelay}s forwards`,
          zIndex: 2,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Front of flap - OLD color */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: flapFrontColor,
            backfaceVisibility: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
        {/* Back of flap - NEW color (lands on bottom) */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: flapBackColor,
            backfaceVisibility: 'hidden',
            transform: 'rotateX(180deg)',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        />
      </div>

      {/* Center divider line */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          height: '2px',
          background: 'rgba(0,0,0,0.4)',
          transform: 'translateY(-50%)',
          zIndex: 3,
        }}
      />

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes flapFall {
          from {
            transform: rotateX(0deg);
          }
          to {
            transform: rotateX(-180deg);
          }
        }
      `}</style>
    </div>
  )
}

// Matrix Screen Panel Component - Individual screen that moves vertically
function MatrixScreen({
  colIndex,
  rowIndex,
  offset,
  isActive,
}: {
  colIndex: number
  rowIndex: number
  offset: number // Vertical offset (-1 to 1)
  isActive: boolean
}) {
  const translateY = offset * 50 // Move up to 50px up or down for more dramatic wave

  return (
    <div
      className="relative"
      style={{
        width: '120px',
        height: '100px',
        transform: `translateY(${translateY}px)`,
        transition: 'transform 1s cubic-bezier(0.4, 0, 0.2, 1)', // Slower, smoother motion
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Main screen face - always glowing */}
      <div
        className="absolute inset-0 rounded-sm overflow-hidden"
        style={{
          background: `linear-gradient(135deg,
            rgba(6, 182, 212, 0.6) 0%,
            rgba(8, 145, 178, 0.7) 50%,
            rgba(14, 116, 144, 0.5) 100%)`,
          boxShadow: `
            0 0 25px rgba(6, 182, 212, 0.5),
            0 0 50px rgba(6, 182, 212, 0.3),
            0 ${5 + Math.abs(offset) * 10}px ${15 + Math.abs(offset) * 10}px rgba(0, 0, 0, 0.5),
            inset 0 0 30px rgba(6, 182, 212, 0.4)
          `,
          border: '1px solid rgba(6, 182, 212, 0.5)',
          transition: 'box-shadow 1s ease, background 1s ease',
        }}
      >
        {/* Circuit pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: 0.7,
            backgroundImage: `
              linear-gradient(90deg, transparent 45%, rgba(6, 182, 212, 0.5) 50%, transparent 55%),
              linear-gradient(0deg, transparent 45%, rgba(6, 182, 212, 0.4) 50%, transparent 55%),
              linear-gradient(45deg, transparent 48%, rgba(6, 182, 212, 0.2) 50%, transparent 52%)
            `,
            backgroundSize: '12px 12px, 12px 12px, 20px 20px',
          }}
        />
        {/* Scan line effect - always visible */}
        <div
          className="absolute inset-0"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6, 182, 212, 0.08) 2px, rgba(6, 182, 212, 0.08) 4px)',
          }}
        />
        {/* Center glow - always visible */}
        <div
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-4 h-4 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.6)',
            }}
          />
        </div>
      </div>
      {/* 3D depth - top edge */}
      <div
        className="absolute top-0 left-0 w-full"
        style={{
          height: '4px',
          transform: 'rotateX(90deg) translateZ(2px)',
          background: 'linear-gradient(90deg, #1a4a5a 0%, #0d3040 100%)',
          boxShadow: '0 0 5px rgba(6, 182, 212, 0.3)',
        }}
      />
      {/* 3D depth - bottom edge */}
      <div
        className="absolute bottom-0 left-0 w-full"
        style={{
          height: '4px',
          transform: 'rotateX(-90deg) translateZ(2px)',
          background: 'linear-gradient(90deg, #0a2530 0%, #153545 100%)',
          boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)',
        }}
      />
      {/* 3D depth - left edge */}
      <div
        className="absolute top-0 left-0 h-full"
        style={{
          width: '4px',
          transform: 'rotateY(-90deg) translateZ(2px)',
          background: 'linear-gradient(180deg, #1a4a5a 0%, #0a2530 100%)',
          boxShadow: '0 0 5px rgba(6, 182, 212, 0.3)',
        }}
      />
      {/* 3D depth - right edge */}
      <div
        className="absolute top-0 right-0 h-full"
        style={{
          width: '4px',
          transform: 'rotateY(90deg) translateZ(2px)',
          background: 'linear-gradient(180deg, #153545 0%, #0d3040 100%)',
          boxShadow: '0 0 5px rgba(6, 182, 212, 0.2)',
        }}
      />
    </div>
  )
}

// Matrix Pillar Component - Column of 3 screens
function MatrixPillar({
  colIndex,
  activatedPillars,
}: {
  colIndex: number
  activatedPillars: Map<number, number[]>
}) {
  const pillarOffsets = activatedPillars.get(colIndex) || [0, 0, 0]

  return (
    <div
      className="flex flex-col"
      style={{
        transformStyle: 'preserve-3d',
        gap: '3px',
      }}
    >
      {[0, 1, 2].map((rowIndex) => {
        const offset = pillarOffsets[rowIndex] || 0
        const isActive = Math.abs(offset) > 0.1

        return (
          <MatrixScreen
            key={rowIndex}
            colIndex={colIndex}
            rowIndex={rowIndex}
            offset={offset}
            isActive={isActive}
          />
        )
      })}
    </div>
  )
}

// HRMS DNA Tower configuration
const HRMS_BOXES = [
  { id: 1, text: 'PAYROLL', backText: 'AUTO' },
  { id: 2, text: 'ATTENDANCE', backText: 'TRACK' },
  { id: 3, text: 'LEAVE', backText: 'MANAGE' },
  { id: 4, text: 'REPORTS', backText: 'DATA' },
  { id: 5, text: 'HRMS', backText: 'SYSTEM' },
]

// Single DNA Pillar for HRMS (no base - base is shared)
function HRMSPillar({
  towerIndex,
  isHovered,
  rotationCycle
}: {
  towerIndex: number
  isHovered: boolean
  rotationCycle: number
}) {
  // Initial rotations - staggered for DNA look, offset by tower index
  const initialRotations = [0, 35, -40, 45, -35, 40]

  // Generate 180 degree rotations
  const getRotation = (boxIndex: number, cycle: number) => {
    if (cycle === 0) return initialRotations[boxIndex] || 0
    const baseRotation = cycle % 2 === 0 ? 180 : 0
    const variation = ((boxIndex * 7 + towerIndex * 3) % 11 - 5)
    return baseRotation + variation
  }

  return (
    <div
      className="relative flex flex-col-reverse items-center"
      style={{
        perspective: '800px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Boxes */}
      {HRMS_BOXES.map((box, index) => (
        <div
          key={box.id}
          className="relative"
          style={{
            marginTop: index === 0 ? 0 : -1,
            zIndex: HRMS_BOXES.length - index,
            transformStyle: 'preserve-3d',
            transform: `rotateY(${getRotation(index + 1, rotationCycle)}deg)`,
            transition: `transform ${isHovered ? 2 : 1.5}s ease-in-out`,
          }}
        >
          <div
            className="w-[90px] h-[28px]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 rounded-sm"
              style={{
                transform: 'translateZ(8px)',
                backfaceVisibility: 'hidden',
                background: '#0a0a0a',
                border: '2px solid #ec4899',
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.3)',
              }}
            >
              <div className="absolute inset-[2px] rounded-sm bg-black flex items-center justify-center">
                <span
                  className="font-black text-[9px] tracking-wide"
                  style={{
                    color: '#ec4899',
                    textShadow: '0 0 8px rgba(236, 72, 153, 0.5)',
                  }}
                >
                  {box.text}
                </span>
              </div>
            </div>

            {/* Back face */}
            <div
              className="absolute inset-0 rounded-sm"
              style={{
                transform: 'translateZ(-8px) rotateY(180deg)',
                backfaceVisibility: 'hidden',
                background: '#0a0a0a',
                border: '2px solid #ec4899',
                boxShadow: '0 0 10px rgba(236, 72, 153, 0.3)',
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="font-black text-[10px]"
                  style={{
                    color: '#ec4899',
                    textShadow: '0 0 8px rgba(236, 72, 153, 0.5)',
                  }}
                >
                  {box.backText}
                </span>
              </div>
            </div>

            {/* Left edge */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                left: 0,
                width: '16px',
                transform: 'rotateY(-90deg)',
                transformOrigin: 'left center',
                background: 'linear-gradient(to right, #831843, #be185d)',
                backfaceVisibility: 'hidden',
              }}
            />

            {/* Right edge */}
            <div
              className="absolute top-0 bottom-0"
              style={{
                right: 0,
                width: '16px',
                transform: 'rotateY(90deg)',
                transformOrigin: 'right center',
                background: 'linear-gradient(to left, #831843, #be185d)',
                backfaceVisibility: 'hidden',
              }}
            />

            {/* Top edge */}
            <div
              className="absolute left-0 right-0"
              style={{
                top: 0,
                height: '16px',
                transform: 'rotateX(90deg)',
                transformOrigin: 'top center',
                background: '#ec4899',
                backfaceVisibility: 'hidden',
              }}
            />

            {/* Bottom edge */}
            <div
              className="absolute left-0 right-0"
              style={{
                bottom: 0,
                height: '16px',
                transform: 'rotateX(-90deg)',
                transformOrigin: 'bottom center',
                background: '#9d174d',
                backfaceVisibility: 'hidden',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

// HRMS Visual - 3 DNA Pillars on one shared base with horizontal movement
function HRMSVisual({ isHovered }: { isHovered: boolean }) {
  const [movementPhase, setMovementPhase] = useState(0)
  const [rotationCycle, setRotationCycle] = useState(0)
  const movementInterval = useRef<NodeJS.Timeout | null>(null)
  const rotationInterval = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isHovered) {
      // Start with phase 1 (move apart)
      setMovementPhase(1)
      setRotationCycle(1)

      // Cycle through movement phases
      movementInterval.current = setInterval(() => {
        setMovementPhase(prev => (prev % 2) + 1) // Alternate between 1 and 2
      }, 2000)

      // Cycle through rotation
      rotationInterval.current = setInterval(() => {
        setRotationCycle(prev => prev + 1)
      }, 2500)
    } else {
      setMovementPhase(0)
      setRotationCycle(0)
      if (movementInterval.current) {
        clearInterval(movementInterval.current)
        movementInterval.current = null
      }
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current)
        rotationInterval.current = null
      }
    }

    return () => {
      if (movementInterval.current) {
        clearInterval(movementInterval.current)
      }
      if (rotationInterval.current) {
        clearInterval(rotationInterval.current)
      }
    }
  }, [isHovered])

  // Calculate horizontal offset for each pillar
  const getHorizontalOffset = (towerIndex: number) => {
    if (movementPhase === 0) return 0

    // Phase 1: move apart, Phase 2: come back
    const distance = movementPhase === 1 ? 40 : 0

    if (towerIndex === 0) return -distance // Left pillar moves left
    if (towerIndex === 2) return distance  // Right pillar moves right
    return 0 // Center pillar stays
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Glow effect */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[150px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(236, 72, 153, 0.4) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* 3 Pillars with horizontal movement */}
      <div className="flex items-end justify-center gap-6 mb-2">
        {[0, 1, 2].map((towerIndex) => (
          <div
            key={towerIndex}
            style={{
              transform: `translateX(${getHorizontalOffset(towerIndex)}px)`,
              transition: 'transform 1s ease-in-out',
            }}
          >
            <HRMSPillar towerIndex={towerIndex} isHovered={isHovered} rotationCycle={rotationCycle} />
          </div>
        ))}
      </div>

      {/* Shared Base - stays fixed */}
      <div
        className="relative"
        style={{
          width: '420px',
          height: '30px',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(5deg)',
        }}
      >
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            transform: 'translateZ(8px)',
            background: 'linear-gradient(180deg, #3a3a3a 0%, #1a1a1a 50%, #0d0d0d 100%)',
            border: '2px solid #ec4899',
            boxShadow: '0 0 15px rgba(236, 72, 153, 0.4)',
          }}
        >
          {/* Base decorations */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[3px]"
            style={{
              background: '#ec4899',
              boxShadow: '0 0 10px rgba(236, 72, 153, 0.6)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Product data
const products = [
  {
    id: "triblock",
    title: "TRIBLOCK",
    subtitle: "Pixel Walls",
    description: "Hundreds of individually motorized blocks creating stunning 3D patterns, waves, and pixel art. Transform any wall into a living canvas of motion.",
    features: ["Individual Block Control", "Unlimited Colors", "Wave Animations", "Interactive & Programmable"],
    gradient: "from-orange-600 via-amber-500 to-yellow-600",
    image: "/Frame 37.png",
    accentColor: "#E17924",
    hasTriblockVisual: true,
  },
  {
    id: "matrix",
    title: "Matrix",
    subtitle: "Kinetic Screen Walls",
    description: "Dynamic screen walls with individually motorized panels creating stunning 3D wave patterns. Transform any space into an immersive visual experience.",
    features: ["Wave Animations", "3D Depth Control", "Interactive Display", "Seamless Integration"],
    gradient: "from-blue-600 via-cyan-500 to-teal-400",
    image: "/matrix-product.png",
    accentColor: "#06b6d4",
    hasMatrixVisual: true,
  },
  {
    id: "hrms",
    title: "HRMS",
    subtitle: "Human Resource Management System",
    description: "Complete HR solution to manage your workforce efficiently. From recruitment to retirement, handle everything seamlessly.",
    features: ["Payroll Automation", "Attendance Tracking", "Performance Reviews", "Leave Management"],
    gradient: "from-purple-600 via-pink-500 to-rose-400",
    image: "/hrms-product.png",
    accentColor: "#ec4899",
    hasHRMSVisual: true,
  },
  {
    id: "flap",
    title: "FLAP",
    subtitle: "Split Flap Display",
    description: "Classic split-flap display technology reimagined. Watch characters flip with satisfying mechanical precision, perfect for arrivals, departures, and dynamic messaging.",
    features: ["Mechanical Flip", "Alphanumeric Display", "Retro Aesthetic", "Custom Messages"],
    gradient: "from-orange-600 via-amber-500 to-yellow-400",
    image: "/flap-product.png",
    accentColor: "#f59e0b",
    hasFlapVisual: true,
  },
]

function ProductCard({ 
  product, 
  index,
  scrollProgress,
}: { 
  product: typeof products[0]
  index: number
  scrollProgress: number
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [blocks] = useState(() => generateTriblocks(TRIBLOCK_ROWS, TRIBLOCK_COLS))
  const [flapBlocks] = useState(() => generateFlapBlocks(FLAP_ROWS, FLAP_COLS))
  const [activatedBlocks, setActivatedBlocks] = useState<Map<string, number>>(new Map())
  const [isFlapFlipped, setIsFlapFlipped] = useState(false)
  const [isHRMSHovered, setIsHRMSHovered] = useState(false)
  const [activatedPillars, setActivatedPillars] = useState<Map<number, number[]>>(new Map())
  const gridRef = useRef<HTMLDivElement>(null)
  const matrixRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  // Generate matrix pillars
  const matrixPillars = useMemo(() => {
    return Array.from({ length: MATRIX_COLS }, (_, i) => i)
  }, [])

  // Calculate animations based on scroll progress
  // More overlap for smoother transitions between products
  const overlapAmount = 0.25 // Products overlap by 25% of total scroll
  const effectiveRange = (1 + overlapAmount * (products.length - 1)) / products.length

  const productStart = index * (effectiveRange - overlapAmount)
  const productEnd = productStart + effectiveRange

  // Animation phases for each product - longer overlap transitions
  const fadeInDuration = effectiveRange * 0.3 // 30% for fade in (longer for smoother)
  const fadeOutDuration = effectiveRange * 0.35 // 35% for fade out (longer for smoother)

  const fadeInStart = productStart
  const fadeInEnd = productStart + fadeInDuration
  const activeStart = fadeInEnd
  const activeEnd = productEnd - fadeOutDuration
  const fadeOutStart = activeEnd
  const fadeOutEnd = productEnd

  let opacity = 0
  let scale = 0.92
  let translateY = 0

  // Smooth easing function
  const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4)
  const easeInQuart = (x: number) => x * x * x * x

  // First product starts fully visible
  if (index === 0 && scrollProgress < fadeInEnd) {
    const progress = Math.max(0, scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart)
    const eased = easeOutQuart(Math.min(1, progress * 1.5))
    opacity = Math.max(0.7, eased) // Start at 70% opacity minimum for first product
    scale = 0.96 + (eased * 0.04)
    translateY = (1 - eased) * 15
  } else if (index === products.length - 1 && scrollProgress >= fadeOutStart) {
    // Last product stays fully visible at the end - no fade out
    opacity = 1
    scale = 1
    translateY = 0
  } else if (scrollProgress >= fadeInStart && scrollProgress < fadeInEnd) {
    // Fading in - slide up and scale in smoothly
    const progress = (scrollProgress - fadeInStart) / (fadeInEnd - fadeInStart)
    const eased = easeOutQuart(progress)
    opacity = eased
    scale = 0.92 + (eased * 0.08) // Scale from 0.92 to 1
    translateY = (1 - eased) * 25 // Slide up from 25px below
  } else if (scrollProgress >= activeStart && scrollProgress < activeEnd) {
    // Fully visible and active
    opacity = 1
    scale = 1
    translateY = 0
  } else if (scrollProgress >= fadeOutStart && scrollProgress < fadeOutEnd) {
    // Fading out while next product fades in (smooth overlap)
    const progress = (scrollProgress - fadeOutStart) / (fadeOutEnd - fadeOutStart)
    const eased = easeInQuart(progress) // Smooth ease in for exit
    opacity = 1 - (eased * 0.65) // Fade to 35% opacity (visible during overlap)
    scale = 1 - (eased * 0.06) // Scale down to 0.94
    translateY = -(eased * 12) // Subtle upward movement
  } else if (scrollProgress >= fadeOutEnd) {
    // After fade out complete
    opacity = 0.35
    scale = 0.94
    translateY = -12
  }

  // Original Triblock mouse move handler - lift/tilt based on proximity
  const handleTriblockMouseMove = useCallback((e: React.MouseEvent) => {
    if (!product.hasTriblockVisual) return
    mousePosRef.current = { x: e.clientX, y: e.clientY }

    if (rafRef.current) return

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null

      if (!mousePosRef.current || !gridRef.current) return

      const rect = gridRef.current.getBoundingClientRect()
      const mouseX = mousePosRef.current.x - rect.left
      const mouseY = mousePosRef.current.y - rect.top

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

          const distance = Math.sqrt(
            Math.pow(mouseX - blockCenterX, 2) + Math.pow(mouseY - blockCenterY, 2)
          )

          if (distance < maxRadius) {
            const intensity = Math.pow(1 - distance / maxRadius, 1.5)
            newActivated.set(`${row}-${col}`, intensity)
          }
        }
      }

      setActivatedBlocks(newActivated)
    })
  }, [product.hasTriblockVisual])

  const handleTriblockMouseLeave = useCallback(() => {
    mousePosRef.current = null
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setActivatedBlocks(new Map())
  }, [])

  // Flap hover handlers - flip animation
  const handleFlapMouseEnter = useCallback(() => {
    if (product.hasFlapVisual) {
      setIsFlapFlipped(true)
    }
  }, [product.hasFlapVisual])

  const handleFlapMouseLeave = useCallback(() => {
    setIsFlapFlipped(false)
  }, [])

  // Matrix wave animation state
  const [isMatrixHovered, setIsMatrixHovered] = useState(false)
  const [wavePhase, setWavePhase] = useState(0)
  const waveIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Start/stop wave animation on hover
  useEffect(() => {
    if (isMatrixHovered && product.hasMatrixVisual) {
      // Start oscillating wave animation - slower
      waveIntervalRef.current = setInterval(() => {
        setWavePhase(prev => prev + 1)
      }, 1500) // Toggle direction every 1.5 seconds

      return () => {
        if (waveIntervalRef.current) {
          clearInterval(waveIntervalRef.current)
        }
      }
    } else {
      // Stop animation and reset
      if (waveIntervalRef.current) {
        clearInterval(waveIntervalRef.current)
        waveIntervalRef.current = null
      }
      setActivatedPillars(new Map())
    }
  }, [isMatrixHovered, product.hasMatrixVisual])

  // Update pillar positions based on wave phase
  useEffect(() => {
    if (!isMatrixHovered || !product.hasMatrixVisual) return

    const newActivated = new Map<number, number[]>()

    // Alternate direction based on phase (odd/even)
    const phaseMultiplier = wavePhase % 2 === 0 ? 1 : -1

    // Define base movement direction for each column (0-5)
    // Col 0, 5 (1st, 6th) -> UP first, then DOWN
    // Col 2, 3 (3rd, 4th) -> DOWN first, then UP
    // Col 1, 4 (2nd, 5th) -> stay same
    const columnDirections = [-1, 0, 1, 1, 0, -1]

    for (let col = 0; col < MATRIX_COLS; col++) {
      const baseDirection = columnDirections[col]
      const direction = baseDirection * phaseMultiplier

      // All 3 screens in the column move together
      const rowOffsets = [0, 1, 2].map(() => direction * 0.9)
      newActivated.set(col, rowOffsets)
    }

    setActivatedPillars(newActivated)
  }, [wavePhase, isMatrixHovered, product.hasMatrixVisual])

  // Mouse enter/leave handlers for matrix
  const handleMatrixMouseEnter = useCallback(() => {
    if (product.hasMatrixVisual) {
      setIsMatrixHovered(true)
      setWavePhase(0)
    }
  }, [product.hasMatrixVisual])

  const handleMatrixMouseLeave = useCallback(() => {
    setIsMatrixHovered(false)
    setWavePhase(0)
    setActivatedPillars(new Map())
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  return (
    <div
      className="sticky top-0 h-screen flex items-center justify-center pointer-events-none"
      style={{
        zIndex: 10 + index, // Stack products on top of each other
      }}
    >
      <div
        className="w-full h-full pointer-events-auto"
        style={{
          opacity,
          transform: `scale(${scale}) translateY(${translateY}px)`,
          transition: 'opacity 0.05s linear, transform 0.05s linear',
          willChange: 'opacity, transform',
        }}
      >
        <div className="relative w-full h-full">
          <div className="relative w-full h-full bg-gradient-to-br from-neutral-900 to-black overflow-hidden">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 h-full px-8 md:px-16 lg:px-24 py-12 lg:py-0">
              {/* Left Column - Content */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-flex items-center gap-2 w-fit">
                  <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${product.gradient} bg-opacity-10 border border-white/20`}>
                    <span className={`text-sm font-semibold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent`}>
                      Product {index + 1} of {products.length}
                    </span>
                  </div>
                </div>

                <div>
                  <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r ${product.gradient} bg-clip-text text-transparent mb-3`}>
                    {product.title}
                  </h2>
                  <p className="text-xl md:text-2xl text-white/60 font-medium">
                    {product.subtitle}
                  </p>
                </div>

                <p className="text-lg text-white/70 leading-relaxed">
                  {product.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                      <Sparkles className="h-4 w-4" style={{ color: product.accentColor }} />
                      <span className="text-sm text-white/80 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                <div>
                  <Link
                    href="#booking"
                    className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${product.gradient} text-white font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300`}
                  >
                    <span>Learn More</span>
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Right Column - Visual */}
              <div className="relative h-[350px] lg:h-auto flex items-center justify-center lg:py-16">
                {product.hasTriblockVisual ? (
                  /* Triblock Blocks Visual - Original lift/tilt animation */
                  <div
                    className="relative"
                    style={{ perspective: '1200px' }}
                    onMouseMove={handleTriblockMouseMove}
                    onMouseLeave={handleTriblockMouseLeave}
                  >
                    <div
                      ref={gridRef}
                      className="relative"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(-20deg) rotateY(25deg)',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${TRIBLOCK_COLS}, 32px)`,
                          gap: '3px',
                        }}
                      >
                        {blocks.map((block) => {
                          const intensity = activatedBlocks.get(block.id) || 0
                          return (
                            <TriPrismBlock
                              key={block.id}
                              colors={block.colors}
                              delay={block.delay}
                              intensity={intensity}
                            />
                          )
                        })}
                      </div>

                      <div
                        className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[700px] h-[120px]"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(225, 121, 36, 0.5) 0%, rgba(186, 86, 23, 0.3) 40%, transparent 70%)',
                          filter: 'blur(25px)',
                        }}
                      />
                    </div>
                  </div>
                ) : product.hasMatrixVisual ? (
                  /* Matrix Screen Pillars Visual - Vertical wave movement */
                  <div
                    className="relative"
                    style={{ perspective: '1000px' }}
                    onMouseEnter={handleMatrixMouseEnter}
                    onMouseLeave={handleMatrixMouseLeave}
                  >
                    <div
                      ref={matrixRef}
                      className="relative"
                      style={{
                        transformStyle: 'preserve-3d',
                        transform: 'rotateX(8deg) rotateY(-12deg)',
                      }}
                    >
                      {/* Matrix frame/housing with extra vertical space for movement */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          padding: '70px 30px', // Extra vertical padding for screen movement
                          background: 'linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%)',
                          borderRadius: '8px',
                          border: '2px solid #2a2a40',
                          boxShadow: `
                            0 30px 60px rgba(0, 0, 0, 0.6),
                            0 15px 30px rgba(0, 0, 0, 0.4),
                            inset 0 1px 1px rgba(255,255,255,0.05),
                            inset 0 -2px 10px rgba(0,0,0,0.3)
                          `,
                          minHeight: '420px', // Ensure enough height for movement
                          alignItems: 'center', // Center pillars vertically
                        }}
                      >
                        {matrixPillars.map((colIndex) => (
                          <MatrixPillar
                            key={colIndex}
                            colIndex={colIndex}
                            activatedPillars={activatedPillars}
                          />
                        ))}
                      </div>

                      {/* Base/stand */}
                      <div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2"
                        style={{
                          width: '90%',
                          height: '20px',
                          background: 'linear-gradient(180deg, #2a2a40 0%, #1a1a2e 100%)',
                          borderRadius: '0 0 8px 8px',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        }}
                      />

                      {/* Glow effect underneath */}
                      <div
                        className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[700px] h-[100px]"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.35) 0%, rgba(8, 145, 178, 0.15) 40%, transparent 70%)',
                          filter: 'blur(25px)',
                        }}
                      />
                    </div>

                    {/* Ambient floating particles */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 rounded-full"
                          style={{
                            left: `${15 + i * 10}%`,
                            top: `${20 + (i % 4) * 18}%`,
                            backgroundColor: 'rgba(6, 182, 212, 0.6)',
                            boxShadow: '0 0 6px rgba(6, 182, 212, 0.4)',
                          }}
                          animate={{
                            y: [-8, 8, -8],
                            x: [-3, 3, -3],
                            opacity: [0.2, 0.7, 0.2],
                          }}
                          transition={{
                            duration: 3 + i * 0.4,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : product.hasHRMSVisual ? (
                  /* HRMS Visual - 3 DNA Towers */
                  <div
                    className="relative"
                    onMouseEnter={() => setIsHRMSHovered(true)}
                    onMouseLeave={() => setIsHRMSHovered(false)}
                  >
                    <HRMSVisual isHovered={isHRMSHovered} />
                  </div>
                ) : product.hasFlapVisual ? (
                  /* Flap Display Visual - Flip animation */
                  <div
                    className="relative"
                    onMouseEnter={handleFlapMouseEnter}
                    onMouseLeave={handleFlapMouseLeave}
                  >
                    <div
                      className="relative"
                      style={{
                        padding: '20px',
                        background: 'linear-gradient(180deg, #2a1a0a 0%, #1a0f05 100%)',
                        borderRadius: '12px',
                        border: '2px solid #4a3020',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                      }}
                    >
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(5, 120px)`,
                          columnGap: '10px',
                          rowGap: '20px',
                        }}
                      >
                        {flapBlocks.map((block) => (
                          <FlapBlock
                            key={block.id}
                            frontColor={block.frontColor}
                            backColor={block.backColor}
                            flipDelay={block.flipDelay}
                            isFlipped={isFlapFlipped}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Glow effect underneath */}
                    <div
                      className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[600px] h-[100px]"
                      style={{
                        background: isFlapFlipped
                          ? 'radial-gradient(ellipse at center, rgba(50, 50, 50, 0.4) 0%, rgba(30, 30, 30, 0.2) 40%, transparent 70%)'
                          : 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.5) 0%, rgba(217, 119, 6, 0.3) 40%, transparent 70%)',
                        filter: 'blur(25px)',
                        transition: 'background 0.8s ease',
                      }}
                    />
                  </div>
                ) : (
                  /* Standard Product Image */
                  <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${product.gradient} opacity-20 transition-opacity duration-700 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`}
                    />

                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-cover"
                      onLoad={() => setImageLoaded(true)}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />

                    <div
                      className="absolute inset-0"
                      style={{
                        boxShadow: `inset 0 0 100px ${product.accentColor}40`,
                      }}
                    />

                    <div className="absolute inset-0 border border-white/20 rounded-2xl" />
                  </div>
                )}
              </div>
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-25 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${product.accentColor}, transparent)` }}
            />
            <div
              className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none"
              style={{ background: `radial-gradient(circle, ${product.accentColor}, transparent)` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ScrollProductShowcase() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"], // Start immediately when section reaches top
  })

  // Update scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrollProgress(latest)
    })

    return () => unsubscribe()
  }, [scrollYProgress])

  // Determine active product for indicator - match the overlap calculation
  const overlapAmount = 0.25
  const effectiveRange = (1 + overlapAmount * (products.length - 1)) / products.length
  const activeIndex = Math.min(
    Math.max(0, Math.floor(scrollProgress / (effectiveRange - overlapAmount))),
    products.length - 1
  )

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{
        // Height for smooth scroll through all products
        height: `${products.length * 100}vh`,
      }}
    >
      {/* Background Grid Pattern */}
      <div className="fixed inset-0 opacity-10 pointer-events-none z-0">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Scroll Progress Indicator */}
      <div className="fixed top-1/2 right-6 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="relative group cursor-pointer"
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'scale-125'
                : 'scale-100 opacity-50'
            }`}
            style={{
              backgroundColor: activeIndex === index ? product.accentColor : '#ffffff',
              boxShadow: activeIndex === index ? `0 0 12px ${product.accentColor}` : 'none'
            }}
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              <span className="text-sm text-white font-medium px-3 py-1.5 rounded-full bg-black/90 border border-white/20">
                {product.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Product Cards - All rendered, controlled by opacity */}
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          index={index}
          scrollProgress={scrollProgress}
        />
      ))}

      {/* Bottom Scroll Hint */}
      <div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 transition-opacity duration-500"
        style={{
          opacity: scrollProgress > 0.9 ? 1 : 0,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm">Continue scrolling</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowRight className="h-5 w-5 text-white/60 rotate-90" />
          </motion.div>
        </div>
      </div>
    </div>
  )
}


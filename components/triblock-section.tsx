"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// Colors for triblock
const TRIBLOCK_COLORS = [
  { face1: '#E17924', face2: '#1A1A1A', face3: '#F5A623' },
  { face1: '#BA5617', face2: '#252525', face3: '#E8943D' },
  { face1: '#D4650E', face2: '#2A2A2A', face3: '#FF8C42' },
  { face1: '#F28C38', face2: '#1F1F1F', face3: '#C96A1A' },
  { face1: '#994E1F', face2: '#333333', face3: '#E07020' },
]

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

// Triblock component
function TriPrismBlock({
  colors,
  delay,
  isVisible,
  intensity,
}: {
  colors: { face1: string; face2: string; face3: string }
  delay: number
  isVisible: boolean
  intensity: number
}) {
  const size = 30
  const lift = intensity * 12
  const tilt = intensity * 25

  return (
    <div
      style={{
        width: size,
        height: size,
        opacity: isVisible ? 1 : 0,
        transform: `scale(${isVisible ? 1 : 0})`,
        transition: `opacity 0.3s ease ${delay}s, transform 0.3s ease ${delay}s`,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          background: `linear-gradient(135deg,
            ${adjustColor(colors.face1, 40)} 0%,
            ${colors.face1} 50%,
            ${adjustColor(colors.face1, -30)} 100%)`,
          borderRadius: '3px',
          transform: `perspective(500px) translateY(${-lift}px) rotateX(${tilt}deg)`,
          transition: 'transform 0.4s ease-out, box-shadow 0.4s ease-out',
          boxShadow: intensity > 0.1
            ? `
              0 ${4 + lift}px ${8 + lift * 2}px rgba(0,0,0,0.5),
              0 ${2 + lift/2}px ${4 + lift}px rgba(0,0,0,0.3),
              inset 0 1px 1px rgba(255,255,255,0.4),
              inset 0 -2px 3px rgba(0,0,0,0.2),
              0 0 ${intensity * 20}px rgba(225,121,36,${intensity * 0.5})
            `
            : `
              0 4px 8px rgba(0,0,0,0.4),
              0 2px 4px rgba(0,0,0,0.2),
              inset 0 1px 1px rgba(255,255,255,0.3),
              inset 0 -2px 3px rgba(0,0,0,0.15)
            `,
        }}
      />
    </div>
  )
}

// Matrix Block component with individual hover
function MatrixBlock({
  index,
  isGridHovered,
  isBlockHovered,
}: {
  index: number
  isGridHovered: boolean
  isBlockHovered: boolean
}) {
  const baseHeights = [80, 120, 60, 100, 140, 70, 110, 90, 130]
  const gridHoverHeights = [140, 80, 120, 60, 100, 130, 70, 110, 90]
  const blockHoverBoost = 40 // Extra height when individual block is hovered

  let currentHeight = baseHeights[index]
  if (isGridHovered) {
    currentHeight = gridHoverHeights[index]
  }
  if (isBlockHovered) {
    currentHeight = Math.min(180, currentHeight + blockHoverBoost)
  }

  const isActive = isBlockHovered || isGridHovered

  return (
    <div
      style={{
        width: 60,
        height: currentHeight,
        background: `linear-gradient(180deg,
          ${isBlockHovered ? '#2a5a8c' : '#1a3a5c'} 0%,
          ${isBlockHovered ? '#1a4060' : '#0d2840'} 30%,
          #061a2e 70%,
          #030d15 100%)`,
        borderRadius: '4px',
        transition: 'height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.3s ease, box-shadow 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: isBlockHovered
          ? `0 0 30px rgba(0, 180, 255, 0.6), 0 8px 30px rgba(0, 150, 255, 0.4), inset 0 1px 2px rgba(255,255,255,0.2), inset 0 -2px 10px rgba(0,0,0,0.5)`
          : `0 4px 20px rgba(0, 150, 255, 0.3), inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 10px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Digital pattern overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            linear-gradient(90deg, transparent 0%, rgba(0,150,255,0.15) 50%, transparent 100%),
            repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,150,255,0.05) 2px, rgba(0,150,255,0.05) 4px)
          `,
          opacity: isActive ? 1 : 0.5,
          transition: 'opacity 0.3s ease',
        }}
      />
      {/* Glow line */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: isBlockHovered ? 3 : 2,
          background: `linear-gradient(90deg, transparent, ${isBlockHovered ? '#00d4ff' : '#00a8ff'}, transparent)`,
          opacity: isActive ? 1 : 0.3,
          transition: 'all 0.3s ease',
        }}
      />
      {/* Bottom glow when hovered */}
      {isBlockHovered && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '10%',
            right: '10%',
            height: 20,
            background: 'linear-gradient(to top, rgba(0,180,255,0.4), transparent)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(2, 4), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(4, 6), 16) + amount))
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export default function TriblockSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const mousePosRef = useRef<{ x: number; y: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  const [blocks] = useState(() => generateTriblocks(12, 18))
  const [animationPhase, setAnimationPhase] = useState<'ball' | 'explode' | 'triblock' | 'matrix'>('ball')
  const [activatedBlocks, setActivatedBlocks] = useState<Map<string, number>>(new Map())
  const [matrixHovered, setMatrixHovered] = useState(false)
  const [hoveredBlockIndex, setHoveredBlockIndex] = useState<number | null>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
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

      for (let row = Math.max(0, centerRow - checkRadius); row < Math.min(12, centerRow + checkRadius + 1); row++) {
        for (let col = Math.max(0, centerCol - checkRadius); col < Math.min(18, centerCol + checkRadius + 1); col++) {
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
  }, [])

  const handleMouseLeave = useCallback(() => {
    mousePosRef.current = null
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    setActivatedBlocks(new Map())
  }, [])

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (value < 0.15) {
      setAnimationPhase('ball')
    } else if (value < 0.25) {
      setAnimationPhase('explode')
    } else if (value < 0.75) {
      setAnimationPhase('triblock')
    } else {
      setAnimationPhase('matrix')
    }
  })

  const ballScale = useTransform(scrollYProgress, [0, 0.1, 0.2], [1.2, 1, 0])
  const ballOpacity = useTransform(scrollYProgress, [0, 0.08, 0.2], [1, 1, 0])
  const ballY = useTransform(scrollYProgress, [0, 0.15], [-50, 0])

  // Triblock transforms - fade out earlier for product transition
  const triblockOpacity = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.85], [0, 1, 1, 0])
  const triblockScale = useTransform(scrollYProgress, [0.2, 0.3, 0.7, 0.85], [0.8, 1, 1, 0.9])
  const triblockRotateX = useTransform(scrollYProgress, [0.2, 0.35], [-55, -35])
  const triblockRotateY = useTransform(scrollYProgress, [0.2, 0.35], [35, 20])

  const triblockContentOpacity = useTransform(scrollYProgress, [0.25, 0.35, 0.65, 0.78], [0, 1, 1, 0])
  const triblockContentX = useTransform(scrollYProgress, [0.25, 0.35], [60, 0])

  // Matrix transforms
  const matrixOpacity = useTransform(scrollYProgress, [0.55, 0.65, 0.9], [0, 1, 1])
  const matrixScale = useTransform(scrollYProgress, [0.55, 0.65], [0.8, 1])
  const matrixContentOpacity = useTransform(scrollYProgress, [0.6, 0.7], [0, 1])
  const matrixContentX = useTransform(scrollYProgress, [0.6, 0.7], [60, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[140vh] bg-black overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-neutral-950 to-black" />

      <div className="sticky top-0 min-h-screen flex items-center py-16">
        <div className="container mx-auto px-4 relative">

          {/* TRIBLOCK PRODUCT */}
          <motion.div
            className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center"
            style={{
              opacity: triblockOpacity,
              scale: triblockScale,
              pointerEvents: animationPhase === 'triblock' || animationPhase === 'explode' || animationPhase === 'ball' ? 'auto' : 'none',
            }}
          >
            <div
              className="relative h-[450px] md:h-[550px] flex items-center justify-center"
              style={{ perspective: '1000px' }}
            >
              {/* Ball */}
              <motion.div
                className="absolute rounded-full"
                style={{
                  width: 80,
                  height: 80,
                  background: 'radial-gradient(circle at 30% 30%, #E17924 0%, #BA5617 40%, #6C2A00 100%)',
                  boxShadow: '0 0 40px rgba(225, 121, 36, 0.8), 0 0 80px rgba(225, 121, 36, 0.4)',
                  scale: ballScale,
                  opacity: ballOpacity,
                  y: ballY,
                }}
              />

              {/* Explosion */}
              {animationPhase === 'explode' && (
                <div className="absolute">
                  {[...Array(20)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        width: 12,
                        height: 12,
                        background: TRIBLOCK_COLORS[i % TRIBLOCK_COLORS.length].face1,
                        boxShadow: `0 0 10px ${TRIBLOCK_COLORS[i % TRIBLOCK_COLORS.length].face1}`,
                        left: '50%',
                        top: '50%',
                        borderRadius: '2px',
                      }}
                      initial={{ x: '-50%', y: '-50%', scale: 1, opacity: 1, rotate: 0 }}
                      animate={{
                        x: Math.cos((i / 20) * Math.PI * 2) * 150 - 6,
                        y: Math.sin((i / 20) * Math.PI * 2) * 150 - 6,
                        scale: [1, 1.3, 0],
                        opacity: [1, 1, 0],
                        rotate: [0, 180, 360],
                      }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                    />
                  ))}
                </div>
              )}

              {/* Triblock Grid */}
              <motion.div
                ref={gridRef}
                className="relative"
                style={{
                  transformStyle: 'preserve-3d',
                  rotateX: triblockRotateX,
                  rotateY: triblockRotateY,
                }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(18, 30px)`,
                    gap: '4px',
                  }}
                >
                  {blocks.map((block) => {
                    const intensity = activatedBlocks.get(block.id) || 0
                    return (
                      <TriPrismBlock
                        key={block.id}
                        colors={block.colors}
                        delay={block.delay}
                        isVisible={animationPhase === 'triblock'}
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
              </motion.div>
            </div>

            {/* Triblock Content */}
            <motion.div
              className="text-center lg:text-left relative z-10"
              style={{
                opacity: triblockContentOpacity,
                x: triblockContentX,
              }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-[#E17924]/10 text-[#E17924] border border-[#E17924]/20">
                New Product
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                <span className="text-white">TRIBLOCK</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E17924] via-[#BA5617] to-[#994E1F]">
                  PIXEL WALLS
                </span>
              </h2>

              <p className="text-base md:text-lg text-white/60 mb-6 max-w-lg mx-auto lg:mx-0">
                Hundreds of individually motorized blocks creating stunning 3D patterns,
                waves, and pixel art. Transform any wall into a living canvas of motion.
              </p>

              <ul className="space-y-2 mb-6 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  'Individual block control',
                  'Unlimited color combinations',
                  'Wave & pattern animations',
                  'Interactive & programmable',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E17924]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="#booking">
                <Button
                  size="lg"
                  className="rounded-full text-base px-6 h-12 bg-gradient-to-r from-[#E17924] to-[#BA5617] text-white font-bold hover:shadow-[0_0_30px_rgba(225,121,36,0.5)] transition-shadow"
                >
                  <span className="flex items-center">
                    Explore Triblock
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* MATRIX PRODUCT */}
          <motion.div
            className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-center absolute inset-0"
            style={{
              opacity: matrixOpacity,
              scale: matrixScale,
              pointerEvents: animationPhase === 'matrix' ? 'auto' : 'none',
            }}
          >
            {/* Matrix Visual */}
            <div className="relative h-[450px] md:h-[550px] flex items-center justify-center">
              <div
                className="relative"
                onMouseEnter={() => setMatrixHovered(true)}
                onMouseLeave={() => setMatrixHovered(false)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '20px',
                  padding: '40px',
                  background: 'linear-gradient(145deg, rgba(10,30,50,0.8) 0%, rgba(5,15,30,0.9) 100%)',
                  borderRadius: '12px',
                  boxShadow: matrixHovered
                    ? '0 0 60px rgba(0,150,255,0.4), 0 20px 60px rgba(0,0,0,0.6)'
                    : '0 0 30px rgba(0,150,255,0.2), 0 20px 40px rgba(0,0,0,0.5)',
                  transition: 'box-shadow 0.4s ease',
                }}
              >
                {[...Array(9)].map((_, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-end"
                    style={{ height: 160 }}
                    onMouseEnter={() => setHoveredBlockIndex(i)}
                    onMouseLeave={() => setHoveredBlockIndex(null)}
                  >
                    <MatrixBlock
                      index={i}
                      isGridHovered={matrixHovered}
                      isBlockHovered={hoveredBlockIndex === i}
                    />
                  </div>
                ))}

                {/* Base platform */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 20,
                    right: 20,
                    height: 8,
                    background: 'linear-gradient(90deg, #0a1a2a, #1a3a5c, #0a1a2a)',
                    borderRadius: '4px',
                    boxShadow: '0 0 20px rgba(0,150,255,0.3)',
                  }}
                />
              </div>

              {/* Glow under matrix */}
              <div
                className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[400px] h-[100px]"
                style={{
                  background: 'radial-gradient(ellipse at center, rgba(0,150,255,0.4) 0%, rgba(0,100,200,0.2) 40%, transparent 70%)',
                  filter: 'blur(30px)',
                }}
              />
            </div>

            {/* Matrix Content */}
            <motion.div
              className="text-center lg:text-left relative z-10"
              style={{
                opacity: matrixContentOpacity,
                x: matrixContentX,
              }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 bg-[#0088ff]/10 text-[#00a8ff] border border-[#0088ff]/20">
                Featured Product
              </span>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
                <span className="text-white">MATRIX</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00a8ff] via-[#0066cc] to-[#004499]">
                  DISPLAY WALLS
                </span>
              </h2>

              <p className="text-base md:text-lg text-white/60 mb-6 max-w-lg mx-auto lg:mx-0">
                Dynamic modular display system with individually controlled panels that move
                in and out to create stunning 3D visual experiences and immersive environments.
              </p>

              <ul className="space-y-2 mb-6 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  'Motorized panel movement',
                  'Seamless video display',
                  'Dynamic 3D patterns',
                  'Architectural integration',
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-white/80 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a8ff]" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href="#booking">
                <Button
                  size="lg"
                  className="rounded-full text-base px-6 h-12 bg-gradient-to-r from-[#0088ff] to-[#0055cc] text-white font-bold hover:shadow-[0_0_30px_rgba(0,136,255,0.5)] transition-shadow"
                >
                  <span className="flex items-center">
                    Explore Matrix
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

interface TrailPoint {
  x: number
  y: number
  id: number
}

const STAR_COLOR = "#FFCC01"

export default function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [sparkles, setSparkles] = useState<TrailPoint[]>([])

  const trailId = useRef(0)
  const sparkleId = useRef(0)
  const moveTimeout = useRef<NodeJS.Timeout | null>(null)
  const lastPosition = useRef({ x: 0, y: 0 })

  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)

  // Smoother spring config - lower stiffness, higher damping
  const springConfig = { damping: 30, stiffness: 150, mass: 0.5 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  // Generate sparkles at slower rate
  const generateSparkle = useCallback(() => {
    sparkleId.current += 1
    const angle = Math.random() * Math.PI * 2
    const distance = 20 + Math.random() * 35
    setSparkles(prev => [
      ...prev.slice(-6),
      {
        x: lastPosition.current.x + Math.cos(angle) * distance,
        y: lastPosition.current.y + Math.sin(angle) * distance,
        id: sparkleId.current
      }
    ])
  }, [])

  useEffect(() => {
    const interval = setInterval(generateSparkle, 350)
    return () => clearInterval(interval)
  }, [generateSparkle])

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      )
    }

    checkTouchDevice()

    let frameId: number
    let lastX = 0
    let lastY = 0

    const updateMousePosition = (e: MouseEvent) => {
      // Throttle updates for smoother feel
      if (frameId) cancelAnimationFrame(frameId)

      frameId = requestAnimationFrame(() => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
        lastPosition.current = { x: e.clientX, y: e.clientY }

        setIsMoving(true)

        if (moveTimeout.current) {
          clearTimeout(moveTimeout.current)
        }

        moveTimeout.current = setTimeout(() => {
          setIsMoving(false)
        }, 200)

        // Only add trail point if moved enough distance
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 8) {
          trailId.current += 1
          setTrail(prev => [
            ...prev.slice(-10),
            { x: e.clientX, y: e.clientY, id: trailId.current }
          ])
          lastX = e.clientX
          lastY = e.clientY
        }
      })
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      setIsPointer(
        target.tagName === "A" ||
          target.tagName === "BUTTON" ||
          target.closest("a") !== null ||
          target.closest("button") !== null,
      )
    }

    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", handleMouseOver)

    return () => {
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", handleMouseOver)
      if (moveTimeout.current) {
        clearTimeout(moveTimeout.current)
      }
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [cursorX, cursorY])

  // Slower retract trail when stopped
  useEffect(() => {
    if (!isMoving) {
      const retractInterval = setInterval(() => {
        setTrail(prev => {
          if (prev.length === 0) return prev
          return prev.slice(1)
        })
      }, 80)
      return () => clearInterval(retractInterval)
    }
  }, [isMoving])

  if (isTouchDevice) {
    return null
  }

  return (
    <>
      {/* Comet Tail - ✦ symbols */}
      {trail.map((point, index) => {
        const progress = index / Math.max(trail.length, 1)
        const size = 10 + progress * 12
        const opacity = 0.2 + progress * 0.6

        return (
          <motion.div
            key={point.id}
            className="fixed pointer-events-none z-[9997]"
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{
              scale: isMoving ? 1 : 0,
              opacity: isMoving ? opacity : 0,
              rotate: 360
            }}
            transition={{
              scale: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.4, ease: "easeOut" },
              rotate: { duration: 6, repeat: Infinity, ease: "linear" }
            }}
            style={{
              left: point.x,
              top: point.y,
              transform: "translate(-50%, -50%)",
              fontSize: size,
              color: STAR_COLOR,
              textShadow: `0 0 ${size/2}px ${STAR_COLOR}, 0 0 ${size}px ${STAR_COLOR}`,
            }}
          >
            ✦
          </motion.div>
        )
      })}

      {/* Sparkles - smooth continuous animation */}
      {sparkles.map((sparkle) => (
        <motion.div
          key={sparkle.id}
          className="fixed pointer-events-none z-[9998]"
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{
            scale: [0, 1.2, 0],
            opacity: [0, 0.9, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
            times: [0, 0.4, 1]
          }}
          style={{
            left: sparkle.x,
            top: sparkle.y,
            transform: "translate(-50%, -50%)",
            fontSize: 10 + Math.random() * 8,
            color: STAR_COLOR,
            textShadow: `0 0 10px ${STAR_COLOR}, 0 0 20px ${STAR_COLOR}`,
          }}
        >
          ✦
        </motion.div>
      ))}

      {/* Glowing aura - slower pulse */}
      <motion.div
        className="fixed pointer-events-none z-[9998] rounded-full"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
          width: 70,
          height: 70,
          background: `radial-gradient(circle, ${STAR_COLOR}35 0%, transparent 70%)`,
          filter: "blur(15px)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Main Star Cursor */}
      <motion.div
        className="fixed pointer-events-none z-[9999]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.div
          className="relative"
          animate={{
            rotate: isPointer ? 45 : [0, 10, -10, 0],
            scale: isPointer ? 1.3 : 1,
          }}
          transition={{
            rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            scale: { duration: 0.4, ease: "easeOut" }
          }}
        >
          {/* Main star */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              fontSize: 30,
              lineHeight: 1,
              color: STAR_COLOR,
              textShadow: `0 0 12px ${STAR_COLOR}, 0 0 24px ${STAR_COLOR}, 0 0 36px ${STAR_COLOR}`,
            }}
          >
            ✦
          </motion.div>
        </motion.div>

        {/* Orbiting stars - slower rotation */}
        <motion.div
          className="absolute top-1/2 left-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        >
          <motion.span
            className="absolute"
            style={{
              top: -28,
              left: -7,
              fontSize: 13,
              color: STAR_COLOR,
              textShadow: `0 0 10px ${STAR_COLOR}`
            }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.9, 0.5, 0.9] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            ✦
          </motion.span>
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2"
          animate={{ rotate: -360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <motion.span
            className="absolute"
            style={{
              top: 22,
              left: -6,
              fontSize: 10,
              color: STAR_COLOR,
              textShadow: `0 0 8px ${STAR_COLOR}`
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.4, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          >
            ✦
          </motion.span>
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/2"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        >
          <motion.span
            className="absolute"
            style={{
              top: -8,
              left: 24,
              fontSize: 8,
              color: STAR_COLOR,
              textShadow: `0 0 6px ${STAR_COLOR}`
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.35, 0.7] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          >
            ✦
          </motion.span>
        </motion.div>
      </motion.div>
    </>
  )
}

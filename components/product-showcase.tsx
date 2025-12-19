"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

const products = [
  {
    id: 1,
    image: "/permanent-interactive-installation.jpg",
  },
  {
    id: 2,
    image: "/exhibition-hologram-display.jpg",
  },
  {
    id: 3,
    image: "/corporate-kinetic-display.jpg",
  },
  {
    id: 4,
    image: "/museum-kinetic-installation.jpg",
  },
]

function StackingCard({ product, index, totalCards, progress }: {
  product: typeof products[0]
  index: number
  totalCards: number
  progress: any
}) {
  const cardStart = index / totalCards
  const cardMid = (index + 0.5) / totalCards
  const cardEnd = (index + 1) / totalCards

  // Smooth Y animation with eased entrance
  const y = useTransform(
    progress,
    [cardStart, cardMid, cardEnd],
    ["100%", "8%", "0%"],
    { clamp: true }
  )

  // Opacity - smooth fade in
  const opacity = useTransform(
    progress,
    [cardStart, cardStart + 0.03, cardMid],
    [0, 0.6, 1],
    { clamp: true }
  )

  // Subtle pop-up scale - starts smaller, slightly overshoots, settles
  const popScale = useTransform(
    progress,
    [cardStart, cardMid, cardEnd],
    [0.96, 1.015, 1],
    { clamp: true }
  )

  // Scale down slightly as more cards stack on top
  const stackScale = useTransform(
    progress,
    [cardEnd, 1],
    [1, 1 - (totalCards - 1 - index) * 0.02]
  )

  // First card is always visible and static
  if (index === 0) {
    return (
      <motion.div
        className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl"
        style={{
          zIndex: 1,
        }}
      >
        <img
          src={product.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl will-change-transform"
      style={{
        y,
        opacity,
        scale: popScale,
        zIndex: index + 1,
      }}
    >
      <motion.div
        className="w-full h-full"
        style={{ scale: stackScale }}
      >
        <img
          src={product.image}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>
    </motion.div>
  )
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  return (
    <section id="products" ref={sectionRef} className="relative bg-background" style={{ height: `${(products.length + 1) * 100}vh` }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <p className="text-sm uppercase tracking-wider text-solar mb-4 font-semibold">Our Craft</p>
            <h2 className="text-4xl md:text-6xl font-bold text-balance mb-6">Experiences That Transform</h2>
          </motion.div>

          <div className="relative w-full max-w-4xl mx-auto aspect-[16/10] md:aspect-[16/9] overflow-hidden rounded-2xl">
            {products.map((product, index) => (
              <StackingCard
                key={product.id}
                product={product}
                index={index}
                totalCards={products.length}
                progress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

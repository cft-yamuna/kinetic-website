"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import Image from "next/image"

const products = [
  {
    id: 1,
    title: "Kinetic Wall Installation",
    category: "Museums & Galleries",
    image: "/1.png",
    description: "Mesmerizing wave patterns that respond to human presence",
    stats: "3M+ Views",
  },
  {
    id: 2,
    title: "Holographic Display",
    category: "Exhibitions",
    image: "/2.png",
    description: "3D floating visuals that captivate audiences",
    stats: "50+ Installations",
  },
  {
    id: 3,
    title: "Interactive LED Canvas",
    category: "Corporate Spaces",
    image: "/3.png",
    description: "Touch-responsive displays for immersive storytelling",
    stats: "Award Winning",
  },
]

function FeaturedCard({ product }: { product: typeof products[0] }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-100px" })

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer col-span-full lg:col-span-8 row-span-2"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[400px] md:h-[450px] lg:h-full lg:min-h-[500px] rounded-2xl overflow-hidden">
        {/* Loading Placeholder */}
        <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />

        {/* Image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{
            opacity: { duration: 0.8, ease: "easeOut" },
            scale: { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 100vw, 66vw"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Hover Border */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 2px rgba(254, 204, 0, 0.6)"
              : "inset 0 0 0 1px rgba(255, 255, 255, 0.1)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

function SmallCard({ product, index }: { product: typeof products[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: true, margin: "-50px" })

  return (
    <motion.div
      ref={cardRef}
      className="relative group cursor-pointer lg:flex-1"
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-[200px] sm:h-[180px] lg:h-full lg:min-h-[240px] rounded-xl overflow-hidden">
        {/* Loading Placeholder */}
        <div className={`absolute inset-0 bg-neutral-900 transition-opacity duration-700 ${isLoaded ? 'opacity-0' : 'opacity-100'}`} />

        {/* Image */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{
            opacity: isLoaded ? 1 : 0,
            scale: isHovered ? 1.08 : 1
          }}
          transition={{
            opacity: { duration: 0.7, ease: "easeOut" },
            scale: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
          }}
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
        </motion.div>

        {/* Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
          transition={{ duration: 0.4 }}
        />

        {/* Hover Border */}
        <motion.div
          className="absolute inset-0 rounded-xl pointer-events-none"
          animate={{
            boxShadow: isHovered
              ? "inset 0 0 0 2px rgba(254, 204, 0, 0.5), 0 20px 40px rgba(0,0,0,0.3)"
              : "inset 0 0 0 1px rgba(255, 255, 255, 0.08)",
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export default function ProductShowcase() {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

  return (
    <section
      id="products"
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-black overflow-hidden"
    >
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 grid-pattern" />
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sunbeam/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-amber/5 rounded-full blur-[180px]" />

      {/* Box Grid Pattern - bottom right */}
      <div
        className="absolute -bottom-10 -right-10 w-72 h-72 md:w-[400px] md:h-[400px] lg:w-[500px] lg:h-[500px] opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '16px 16px'
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="mb-10">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            Experiences That{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">
              Leave a Mark
            </span>
          </motion.h2>
        </div>

        {/* Magazine-Style Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Featured Large Card */}
          <FeaturedCard product={products[0]} />

          {/* Right Column - Stacked Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 lg:flex lg:flex-col gap-4 lg:gap-6">
            {products.slice(1).map((product, index) => (
              <SmallCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}

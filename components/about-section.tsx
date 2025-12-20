"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Sparkles, Heart, Palette, Zap } from "lucide-react"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Only return true for mobile after hydration to avoid mismatch
  return hasMounted && isMobile
}

const features = [
  {
    icon: Sparkles,
    title: "Imagination First",
    description:
      "Every project starts with 'what if?' — kinetic installations that breathe and move with human energy.",
  },
  {
    icon: Heart,
    title: "People at the Center",
    description:
      "Technology only matters if it moves people. Interactive displays that respond to touch, emotion, and movement.",
  },
  {
    icon: Palette,
    title: "Art + Engineering",
    description: "Magic happens when code, steel, and creativity breathe together in perfect harmony.",
  },
  {
    icon: Zap,
    title: "Speed with Precision",
    description: "From sketch to stage in days without compromise. Engineering excellence at velocity.",
  },
]

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], [100, -100])

  return (
    <section id="about" ref={sectionRef} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left column - text content */}
          {isMobile ? (
            <div>
              <p className="text-sm uppercase tracking-wider text-copper mb-4 font-semibold">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">
                Originals, Not Catalogues
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-balance">
                Born at the crossroads of imagination, design, and engineering in Bengaluru, Craftech 360 transforms
                physical spaces into immersive stages for wonder. We don't deliver technology — we deliver transformation.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-balance">
                Under one roof, artists and engineers collaborate to engineer originals, from concept to crowd-stopping
                reality in days, not months. We've crafted 950+ experiences across 17 cities in 5 countries, touching 25
                million people.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="text-3xl font-bold mb-1 text-sunbeam">3×</div>
                  <div className="text-sm text-muted-foreground">More foot traffic</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-amber">2.5×</div>
                  <div className="text-sm text-muted-foreground">Longer engagement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-solar">5×</div>
                  <div className="text-sm text-muted-foreground">More sharing</div>
                </div>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <p className="text-sm uppercase tracking-wider text-copper mb-4 font-semibold">Our Story</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance leading-tight">
                Originals, Not Catalogues
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-balance">
                Born at the crossroads of imagination, design, and engineering in Bengaluru, Craftech 360 transforms
                physical spaces into immersive stages for wonder. We don't deliver technology — we deliver transformation.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed text-balance">
                Under one roof, artists and engineers collaborate to engineer originals, from concept to crowd-stopping
                reality in days, not months. We've crafted 950+ experiences across 17 cities in 5 countries, touching 25
                million people.
              </p>
              <div className="grid grid-cols-3 gap-6 mt-8">
                <div>
                  <div className="text-3xl font-bold mb-1 text-sunbeam">3×</div>
                  <div className="text-sm text-muted-foreground">More foot traffic</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-amber">2.5×</div>
                  <div className="text-sm text-muted-foreground">Longer engagement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold mb-1 text-solar">5×</div>
                  <div className="text-sm text-muted-foreground">More sharing</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Right column - feature cards */}
          {isMobile ? (
            <div className="relative">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-card border border-border rounded-2xl p-6 transition-colors hover:border-sunbeam"
                  >
                    <div className="mb-4">
                      <feature.icon className="h-8 w-8 text-amber" />
                    </div>
                    <h3 className="font-bold mb-2 text-balance">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground text-balance leading-relaxed">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div className="relative" style={{ y }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="bg-card border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-sunbeam"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -5 }}
                  >
                    <div className="mb-4">
                      <feature.icon className="h-8 w-8 text-amber" />
                    </div>
                    <h3 className="font-bold mb-2 text-balance">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground text-balance leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}

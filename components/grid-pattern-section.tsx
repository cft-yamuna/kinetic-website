"use client"

import { motion } from "framer-motion"

export default function GridPatternSection() {
  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* 3D Grid Pattern - matching brand guidelines */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 0.96px, transparent 0.96px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 0.96px, transparent 0.96px)
            `,
            backgroundSize: "40px 40px",
            transform: "perspective(1000px) rotateX(60deg) scale(2)",
            transformOrigin: "center top",
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Built on <span className="text-sunbeam">Precision</span>
          </h2>
          <p className="text-xl text-white/70 text-balance">
            Our grid pattern represents the disciplined form that underlies every project — the reliability and
            professionalism of Craftech360's identity.
          </p>
        </motion.div>
      </div>
    </section>
  )
}

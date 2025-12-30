"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import { MapPin, Phone, Mail, Eye, Sparkles, Box, Zap, CheckCircle } from "lucide-react"

const benefits = [
  {
    icon: Eye,
    title: "See Products Live",
    description: "Experience our Triblock, Flap Display, and Matrix screens rotating and flipping in real-time"
  },
  {
    icon: Sparkles,
    title: "Witness the Kinetic Effect",
    description: "Understand why moving screens capture 10x more attention than static displays"
  },
  {
    icon: Box,
    title: "Touch & Feel Quality",
    description: "Inspect the premium build quality, motor precision, and LED clarity up close"
  },
  {
    icon: Zap,
    title: "Custom Demo",
    description: "Get a personalized walkthrough tailored to your business needs and space requirements"
  }
]

const contactInfo = {
  company: "Craftech360",
  legalName: "CFT360 Design Studio Private Limited",
  address: "Survey no 7/2, 1st floor Flower Garden, Divitigeramanahally, Mysore Rd, near BHEL",
  city: "Bengaluru, Karnataka 560026",
  phones: ["9739076766", "8217626226"],
  emails: ["accounts@craftech360.com", "Ravi@craftech360.com"]
}

// Google Maps embed URL for the location
const MAPS_EMBED_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.9!2d77.4891!3d12.9144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDU0JzUxLjgiTiA3N8KwMjknMjAuOCJF!5e0!3m2!1sen!2sin!4v1234567890"

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

  return hasMounted && isMobile
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const isMobile = useIsMobile()

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-20 pb-8 md:pb-12 bg-gradient-to-b from-black via-neutral-950 to-black overflow-hidden"
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, white 1px, transparent 1px),
              linear-gradient(to bottom, white 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Accent glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-sunbeam/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 md:mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 bg-sunbeam/10 border border-sunbeam/30 rounded-full px-4 py-1.5 mb-4">
            <MapPin className="h-4 w-4 text-sunbeam" />
            <span className="text-sm font-medium text-sunbeam">Visit Our Showroom</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">Kinetic Displays</span> in Person
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            Nothing compares to seeing screens that move. Book a visit and witness the future of digital signage.
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* Left Side - Map & Address */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Map Container */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-6">
              <div className="aspect-[4/3] md:aspect-video w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5!2d77.489!3d12.914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae3f0a4f0a0001%3A0x1234567890!2sFlower%20Garden%2C%20Mysore%20Road%2C%20Bengaluru!5e0!3m2!1sen!2sin!4v1703123456789!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Address Card */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunbeam to-amber flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-black" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{contactInfo.company}</h3>
                  <p className="text-sm text-white/40">{contactInfo.legalName}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <p className="text-white/70 leading-relaxed">
                  {contactInfo.address}
                  <br />
                  <span className="text-white font-medium">{contactInfo.city}</span>
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-white/70">
                  <Phone className="h-4 w-4 text-sunbeam flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`tel:${contactInfo.phones[0]}`} className="hover:text-sunbeam transition-colors">
                      +91 {contactInfo.phones[0]}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70">
                  <Phone className="h-4 w-4 text-sunbeam flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`tel:${contactInfo.phones[1]}`} className="hover:text-sunbeam transition-colors">
                      +91 {contactInfo.phones[1]}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-white/70 md:col-span-2">
                  <Mail className="h-4 w-4 text-sunbeam flex-shrink-0" />
                  <div className="text-sm">
                    <a href={`mailto:${contactInfo.emails[1]}`} className="hover:text-sunbeam transition-colors">
                      {contactInfo.emails[1]}
                    </a>
                  </div>
                </div>
              </div>

              {/* Directions Button */}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(contactInfo.address + ', ' + contactInfo.city)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 hover:border-sunbeam/30 transition-all"
              >
                <MapPin className="h-4 w-4" />
                Get Directions
              </a>
            </div>
          </motion.div>

          {/* Right Side - Why Visit */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 h-full">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Why Visit Our Showroom?
              </h3>
              <p className="text-white/50 mb-8">
                See what websites and videos can't show you
              </p>

              {/* Benefits List */}
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    className="flex gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sunbeam/20 to-amber/10 border border-sunbeam/20 flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-sunbeam" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">{benefit.title}</h4>
                      <p className="text-sm text-white/50 leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* What You'll See */}
              <div className="mt-8 pt-6 border-t border-white/10">
                <h4 className="text-sm font-medium text-white/40 uppercase tracking-wider mb-4">
                  Products on Display
                </h4>
                <div className="flex flex-wrap gap-2">
                  {['Triblock Display', 'Flap Board', 'LED Matrix', 'Kinetic Tower', 'Custom Solutions'].map((product) => (
                    <span
                      key={product}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sunbeam/10 border border-sunbeam/20 text-sm text-sunbeam"
                    >
                      <CheckCircle className="h-3 w-3" />
                      {product}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        </div>

      </div>
    </section>
  )
}

"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Phone, Navigation, MapPin } from "lucide-react"

const contactInfo = {
  company: "Craftech360",
  address: "WGWP+WV6, Ranganathan Colony, Deepanjali Nagar",
  city: "Bengaluru, Karnataka 560026",
  phone: "9739076766",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=WGWP%2BWV6%2C+Deepanjali+Nagar%2C+Bengaluru"
}

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-50px" })

  return (
    // Only show on mobile, hidden on desktop (location is in booking section on desktop)
    <section
      ref={sectionRef}
      className="relative py-10 bg-[#0a0a0a] overflow-hidden lg:hidden"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-lg mx-auto">

          {/* Compact Header */}
          <motion.div
            className="flex items-center gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <MapPin className="w-4 h-4 text-sunbeam" />
            <span className="text-sunbeam text-xs font-bold tracking-[0.15em] uppercase">
              Showroom Location
            </span>
          </motion.div>

          {/* Compact Map Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative h-[180px] rounded-xl overflow-hidden border border-white/10 group mb-4">
              {/* Map */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.2!2d77.5089!3d12.9367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b277a93807%3A0x88437a0ef6428454!2sDeepanjali%20Nagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1703900000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Get Directions Button */}
              <a
                href={contactInfo.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-sunbeam flex items-center justify-center hover:scale-110 transition-transform shadow-lg"
              >
                <Navigation className="h-4 w-4 text-black" />
              </a>
            </div>

            {/* Compact Info Row */}
            <div className="flex items-center justify-between gap-4 bg-white/[0.03] rounded-xl p-4 border border-white/10">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-0.5">{contactInfo.company}</h3>
                <p className="text-white/50 text-xs truncate">
                  {contactInfo.city}
                </p>
              </div>
              <a
                href={`tel:${contactInfo.phone}`}
                className="flex items-center gap-2 bg-sunbeam/10 hover:bg-sunbeam/20 px-3 py-2 rounded-lg transition-colors"
              >
                <Phone className="h-4 w-4 text-sunbeam" />
                <span className="text-white text-sm font-medium">Call</span>
              </a>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, CheckCircle2, Loader2, User, Mail, Phone, Building2, MapPin, Navigation } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Single time slot per day at 5 PM
const TIME_SLOTS = [
  { id: "evening", time: "5:00 PM", label: "Evening Session" },
]

// Location info for desktop view
const locationInfo = {
  company: "Craftech360",
  address: "WGWP+WV6, Ranganathan Colony, Deepanjali Nagar",
  city: "Bengaluru, Karnataka 560026",
  phone: "9964299111",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=WGWP%2BWV6%2C+Deepanjali+Nagar%2C+Bengaluru"
}

// Booking month configuration
const BOOKING_YEAR = 2026
const BOOKING_MONTH = 0 // January (0-indexed)
const MONTH_NAME = "January"

// Generate days for January 2026
function generateCalendarDays() {
  const firstDay = new Date(BOOKING_YEAR, BOOKING_MONTH, 1)
  const lastDay = new Date(BOOKING_YEAR, BOOKING_MONTH + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = firstDay.getDay() // 0 = Sunday

  const days: (number | null)[] = []

  // Add empty slots for days before the 1st
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null)
  }

  // Add all days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(day)
  }

  return days
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

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

export default function BookingSection() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const isMobile = useIsMobile()

  const calendarDays = useMemo(() => generateCalendarDays(), [])

  const isSlotBooked = (_day: number, _slotId: string) => {
    // Always return false to allow multiple bookings on the same slot
    return false
  }

  const isDayFullyBooked = (_day: number) => {
    // Always return false to allow multiple bookings on the same day
    return false
  }

  // Check if a day is Sunday (not available)
  const isSunday = (day: number) => {
    const date = new Date(BOOKING_YEAR, BOOKING_MONTH, day)
    return date.getDay() === 0 // 0 = Sunday
  }

  // Check if a day is in the past
  const isPastDate = (day: number) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    const dateToCheck = new Date(BOOKING_YEAR, BOOKING_MONTH, day)
    return dateToCheck < today
  }

  const handleDateSelect = (day: number) => {
    if (isDayFullyBooked(day) || isSunday(day) || isPastDate(day)) return
    setSelectedDate(day)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slotId: string) => {
    if (selectedDate && isSlotBooked(selectedDate, slotId)) return
    setSelectedSlot(slotId)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 10) {
      setFormData({ ...formData, phone: value })
      if (value.length === 10) {
        setPhoneError("")
      } else if (value.length > 0) {
        setPhoneError("Phone number must be 10 digits")
      } else {
        setPhoneError("")
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) return

    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits")
      return
    }

    setIsSubmitting(true)

    try {
      const slotDetails = TIME_SLOTS.find(s => s.id === selectedSlot)

      const { error } = await supabase
        .from("kinetic-data")
        .insert({
          name: formData.name,
          phone_num: parseInt(formData.phone, 10),
          email: formData.email,
          work: `Booking: ${MONTH_NAME} ${selectedDate}, ${BOOKING_YEAR} at ${slotDetails?.time} | Company: ${formData.company}`
        })

      if (error) {
        console.error("Error saving to Supabase:", error)
        alert("Failed to save booking. Please try again.")
        setIsSubmitting(false)
        return
      }

      // Send confirmation email
      try {
        await fetch('/api/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            date: `${MONTH_NAME} ${selectedDate}, ${BOOKING_YEAR}`,
            time: slotDetails?.time
          })
        })
      } catch (emailError) {
        // Don't fail the booking if email fails, just log it
        console.error("Email send error:", emailError)
      }

      setIsSubmitted(true)
    } catch (err) {
      console.error("Error:", err)
      alert("Failed to save booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setIsSubmitted(false)
    setSelectedDate(null)
    setSelectedSlot(null)
    setFormData({ name: "", email: "", phone: "", company: "" })
  }

  const selectedSlotDetails = TIME_SLOTS.find((s) => s.id === selectedSlot)

  return (
    <section id="booking" className="relative py-16 md:py-24 px-4 lg:px-12 bg-gradient-to-b from-black via-neutral-900 to-black overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-10 md:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
       

          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Book a <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-500 bg-clip-text text-transparent">Demo</span>
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-2xl mx-auto">
            Schedule a personalized demo to see our kinetic displays in action. Choose a date and time that works for you.
          </p>

          {/* Value props */}
        
        </motion.div>

        <AnimatePresence mode="wait">
          {isSubmitted ? (
            /* Success State */
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-lg mx-auto"
            >
              <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </motion.div>

                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Booking Confirmed!</h3>
                <p className="text-white/50 mb-8">
                  We&apos;ll send a confirmation to {formData.email}
                </p>

                <div className="bg-orange-500/10 rounded-2xl p-6 mb-8 border border-orange-500/20 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/50">Date:</span>
                      <span className="font-semibold text-white">{MONTH_NAME} {selectedDate}, {BOOKING_YEAR}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Time:</span>
                      <span className="font-semibold text-white">{selectedSlotDetails?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Name:</span>
                      <span className="font-semibold text-white">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Company:</span>
                      <span className="font-semibold text-white">{formData.company}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  Book Another Demo
                </button>
              </div>
            </motion.div>
          ) : (
            /* Calendar and Form */
            <motion.div
              key="booking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 lg:space-y-8"
            >
              <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Calendar Section */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-5 md:p-8 border border-white/10"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Month Header */}
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" />
                    {MONTH_NAME} {BOOKING_YEAR}
                  </h3>
                  <span className="text-xs md:text-sm text-white/50">Select a date</span>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {WEEKDAYS.map((day) => (
                    <div key={day} className="text-center text-xs font-medium text-white/40 py-2">
                      {isMobile ? day.charAt(0) : day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} className="aspect-square" />
                    }

                    const isFullyBooked = isDayFullyBooked(day)
                    const isSundayDate = isSunday(day)
                    const isPast = isPastDate(day)
                    const isUnavailable = isFullyBooked || isSundayDate || isPast
                    const isSelected = selectedDate === day

                    return (
                      <div key={day} className="relative group">
                        <motion.button
                          onClick={() => !isUnavailable && handleDateSelect(day)}
                          disabled={isUnavailable}
                          className={`
                            aspect-square rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200
                            flex items-center justify-center relative w-full
                            ${isSelected
                              ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                              : isPast
                                ? "bg-white/5 text-white/20 cursor-not-allowed border border-white/5"
                                : isSundayDate
                                  ? "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                                  : isFullyBooked
                                    ? "bg-red-500/20 text-white/40 cursor-not-allowed border border-red-500/30"
                                    : "bg-white/5 text-white hover:bg-white/10"
                            }
                          `}
                          whileHover={!isUnavailable ? { scale: 1.05 } : {}}
                          whileTap={!isUnavailable ? { scale: 0.95 } : {}}
                        >
                          {day}
                        </motion.button>
                        {/* Tooltip for Sunday dates */}
                        {isSundayDate && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/20 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            Closed on Sundays
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/20" />
                          </div>
                        )}
                        {/* Tooltip for past dates */}
                        {isPast && !isSundayDate && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white/20 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            Date Passed
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/20" />
                          </div>
                        )}
                        {/* Tooltip for booked dates */}
                        {isFullyBooked && !isSundayDate && !isPast && (
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-red-500 text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                            Already Booked
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-500" />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-3 md:gap-4 mt-5 text-xs text-white/50">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-gradient-to-br from-orange-500 to-amber-500" />
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-white/5 border border-white/10" />
                    <span>Closed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-white/10" />
                    <span>Available</span>
                  </div>
                </div>

                {/* Time Slots */}
                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-5 pt-5 pb-4 border-t border-white/10"
                    >
                      <h4 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        Session Time for {MONTH_NAME} {selectedDate}
                      </h4>
                      <div className="grid grid-cols-1 gap-3">
                        {TIME_SLOTS.map((slot) => {
                          const isBooked = isSlotBooked(selectedDate, slot.id)
                          const isSelectedSlot = selectedSlot === slot.id

                          return (
                            <motion.button
                              key={slot.id}
                              onClick={() => handleSlotSelect(slot.id)}
                              disabled={isBooked}
                              className={`
                                p-3 md:p-4 rounded-xl text-left transition-all duration-200 relative overflow-hidden
                                ${isSelectedSlot
                                  ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                                  : isBooked
                                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                                    : "bg-white/5 text-white hover:bg-white/10 border border-orange-500/40"
                                }
                              `}
                              whileHover={!isBooked && !isSelectedSlot ? { scale: 1.02 } : {}}
                              whileTap={!isBooked && !isSelectedSlot ? { scale: 0.98 } : {}}
                            >
                              {/* Subtle fade animation for unselected available slot */}
                              {!isBooked && !isSelectedSlot && (
                                <motion.div
                                  className="absolute inset-0 bg-orange-500/20 rounded-xl"
                                  animate={{ opacity: [0.4, 0.8, 0.4] }}
                                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                              )}
                              <div className="relative z-10">
                                <div className="text-base md:text-lg font-semibold">{slot.time}</div>
                                <div className={`text-xs ${isSelectedSlot ? "text-white/80" : "text-white/50"}`}>
                                  {isBooked ? "Booked" : slot.label}
                                </div>
                              </div>
                            </motion.button>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Booking Form Section */}
              <motion.div
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-5 md:p-8 border border-white/10"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-white mb-5">Your Details</h3>

                {/* Selected Date/Time Summary */}
                {selectedDate && selectedSlot && (
                  <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                    <div className="text-sm text-white/50 mb-1">Selected Appointment</div>
                    <div className="text-white font-semibold">
                      {MONTH_NAME} {selectedDate}, {BOOKING_YEAR} at {selectedSlotDetails?.time}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <User className="h-4 w-4 inline mr-2 text-orange-500" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <Mail className="h-4 w-4 inline mr-2 text-orange-500" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>

                  {/* Phone Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <Phone className="h-4 w-4 inline mr-2 text-orange-500" />
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      required
                      placeholder="10-digit phone number"
                      maxLength={10}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                    {phoneError && <p className="text-sm text-red-400 mt-1">{phoneError}</p>}
                  </div>

                  {/* Company Input */}
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      <Building2 className="h-4 w-4 inline mr-2 text-orange-500" />
                      Company / What You Do
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                      placeholder="Your company or business"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={!selectedDate || !selectedSlot || isSubmitting || !formData.name || !formData.email || !formData.phone || formData.phone.length !== 10 || !formData.company}
                    className={`
                      w-full py-4 rounded-xl font-semibold text-white mt-4 transition-all duration-300 relative overflow-hidden
                      ${selectedDate && selectedSlot && formData.name && formData.email && formData.phone.length === 10 && formData.company
                        ? "bg-gradient-to-r from-orange-600 to-amber-500 hover:shadow-lg hover:shadow-orange-500/30"
                        : "bg-white/10 cursor-not-allowed"
                      }
                    `}
                    whileHover={selectedDate && selectedSlot && formData.phone.length === 10 && formData.company ? { scale: 1.02 } : {}}
                    whileTap={selectedDate && selectedSlot && formData.phone.length === 10 && formData.company ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Confirming...
                      </span>
                    ) : !selectedDate ? (
                      "Select a Date"
                    ) : !selectedSlot ? (
                      "Select a Time Slot"
                    ) : (
                      <>
                        {selectedDate && selectedSlot && formData.name && formData.email && formData.phone.length === 10 && formData.company && (
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          />
                        )}
                        <span className="relative">Confirm Booking</span>
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Info */}
                <p className="text-xs text-white/30 text-center mt-4">
                  By booking, you agree to receive communication about your appointment.
                </p>
              </motion.div>
              </div>

              {/* Location Section - Desktop Only */}
              <motion.div
                className="hidden lg:block"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
                  <div className="grid lg:grid-cols-3">
                    {/* Map */}
                    <div className="relative h-[200px] lg:h-auto">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.2!2d77.5089!3d12.9367!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae15b277a93807%3A0x88437a0ef6428454!2sDeepanjali%20Nagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1703900000000!5m2!1sen!2sin"
                        width="100%"
                        height="100%"
                        style={{ border: 0, position: 'absolute', inset: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="grayscale hover:grayscale-0 transition-all duration-500"
                      />
                    </div>

                    {/* Location Info */}
                    <div className="lg:col-span-2 p-6 flex items-center">
                      <div className="flex items-center justify-between w-full gap-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold text-lg mb-1">{locationInfo.company}</h4>
                            <p className="text-white/50 text-sm leading-relaxed max-w-md">
                              {locationInfo.address}, {locationInfo.city}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <a
                            href={`tel:${locationInfo.phone}`}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-4 py-3 rounded-xl transition-colors border border-white/10"
                          >
                            <Phone className="h-4 w-4 text-orange-500" />
                            <span className="text-white text-sm font-medium">+91 {locationInfo.phone}</span>
                          </a>
                          <a
                            href={locationInfo.mapUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 px-4 py-3 rounded-xl transition-colors"
                          >
                            <Navigation className="h-4 w-4 text-black" />
                            <span className="text-black text-sm font-medium">Get Directions</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

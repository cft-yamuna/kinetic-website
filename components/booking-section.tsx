"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, CheckCircle2, Loader2, User, Mail, Phone, Building2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

// Time slots available each day
const TIME_SLOTS = [
  { id: "morning", time: "11:30 AM", label: "Morning Session" },
  { id: "afternoon", time: "3:00 PM", label: "Afternoon Session" },
]

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
  const [bookedSlots, setBookedSlots] = useState<Record<string, string[]>>({})
  const isMobile = useIsMobile()

  const calendarDays = useMemo(() => generateCalendarDays(), [])

  const formatDateKey = (day: number) => {
    return `${BOOKING_YEAR}-${String(BOOKING_MONTH + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isSlotBooked = (day: number, slotId: string) => {
    const dateKey = formatDateKey(day)
    return bookedSlots[dateKey]?.includes(slotId) || false
  }

  const isDayFullyBooked = (day: number) => {
    const dateKey = formatDateKey(day)
    const booked = bookedSlots[dateKey] || []
    return booked.length >= 2
  }

  const handleDateSelect = (day: number) => {
    if (isDayFullyBooked(day)) return
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
      const dateKey = formatDateKey(selectedDate)
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

      // Add to booked slots locally
      setBookedSlots((prev) => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), selectedSlot],
      }))

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
          <div className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/30 rounded-full px-4 py-1.5 mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-sm font-medium text-orange-400">Limited slots for {MONTH_NAME} {BOOKING_YEAR}</span>
          </div>

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
              className="grid lg:grid-cols-2 gap-6 lg:gap-8"
            >
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
                    const isSelected = selectedDate === day

                    return (
                      <motion.button
                        key={day}
                        onClick={() => !isFullyBooked && handleDateSelect(day)}
                        disabled={isFullyBooked}
                        className={`
                          aspect-square rounded-lg md:rounded-xl text-xs md:text-sm font-medium transition-all duration-200
                          flex items-center justify-center relative
                          ${isSelected
                            ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                            : isFullyBooked
                              ? "bg-white/5 text-white/20 cursor-not-allowed"
                              : "bg-white/5 text-white hover:bg-white/10"
                          }
                        `}
                        whileHover={!isFullyBooked ? { scale: 1.05 } : {}}
                        whileTap={!isFullyBooked ? { scale: 0.95 } : {}}
                      >
                        {day}
                        {isFullyBooked && (
                          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                        )}
                      </motion.button>
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
                    <div className="w-3 h-3 rounded bg-white/5 relative">
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full" />
                    </div>
                    <span>Fully Booked</span>
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
                      className="mt-5 pt-5 border-t border-white/10"
                    >
                      <h4 className="text-sm font-medium text-white/70 mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        Available Times for {MONTH_NAME} {selectedDate}
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {TIME_SLOTS.map((slot) => {
                          const isBooked = isSlotBooked(selectedDate, slot.id)
                          const isSelectedSlot = selectedSlot === slot.id

                          return (
                            <motion.button
                              key={slot.id}
                              onClick={() => handleSlotSelect(slot.id)}
                              disabled={isBooked}
                              className={`
                                p-3 md:p-4 rounded-xl text-left transition-all duration-200
                                ${isSelectedSlot
                                  ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white"
                                  : isBooked
                                    ? "bg-white/5 text-white/30 cursor-not-allowed"
                                    : "bg-white/5 text-white hover:bg-white/10 border border-transparent hover:border-orange-500/30"
                                }
                              `}
                              whileHover={!isBooked ? { scale: 1.02 } : {}}
                              whileTap={!isBooked ? { scale: 0.98 } : {}}
                            >
                              <div className="text-base md:text-lg font-semibold">{slot.time}</div>
                              <div className={`text-xs ${isSelectedSlot ? "text-white/80" : "text-white/50"}`}>
                                {isBooked ? "Booked" : slot.label}
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

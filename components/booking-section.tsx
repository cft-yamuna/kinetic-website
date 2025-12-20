"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

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

const availableSlots = [
  { date: "2025-01-15", time: "10:00 AM", available: true, popular: false },
  { date: "2025-01-15", time: "2:00 PM", available: true, popular: false },
  { date: "2025-01-16", time: "9:00 AM", available: false, popular: false },
  { date: "2025-01-16", time: "11:00 AM", available: true, popular: false },
  { date: "2025-01-16", time: "3:00 PM", available: true, popular: false },
  { date: "2025-01-17", time: "10:00 AM", available: true, popular: false },
  { date: "2025-01-17", time: "1:00 PM", available: true, popular: false },
  { date: "2025-01-17", time: "4:00 PM", available: false, popular: false },
]

export default function BookingSection() {
  const [step, setStep] = useState<"select" | "form" | "confirmation">("select")
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", purpose: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [phoneError, setPhoneError] = useState("")
  const isMobile = useIsMobile()

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedSlot({ date, time })
    setStep("form")
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "") // Remove non-digits
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

    // Validate phone number
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be 10 digits")
      return
    }

    setIsSubmitting(true)

    try {
      const { error } = await supabase
        .from("kinetic-data")
        .insert({
          name: formData.name,
          phone_num: parseInt(formData.phone, 10),
          email: formData.email,
          work: formData.purpose
        })

      if (error) {
        console.error("Error saving to Supabase:", error)
        alert("Failed to save booking. Please try again.")
        setIsSubmitting(false)
        return
      }

      setStep("confirmation")
    } catch (err) {
      console.error("Error:", err)
      alert("Failed to save booking. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="booking" className="py-24 md:py-32 bg-muted/30 relative overflow-hidden">
      {/* Grid Pattern - Block style */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, currentColor 1px, transparent 1px),
              linear-gradient(to bottom, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Intersecting Lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-sunbeam/20 to-transparent" />
      <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-amber/10 to-transparent" />
      <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-sunbeam/15 to-transparent" />
      <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber/10 to-transparent" />

      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-32 h-32 border-l-2 border-t-2 border-sunbeam/10" />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-r-2 border-b-2 border-sunbeam/10" />

      {/* Decorative Blurs */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-sunbeam/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber/5 rounded-full blur-[120px]" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        {isMobile ? (
          <div className="text-center mb-16">
            {/* Urgency badge - static on mobile */}
            <div className="inline-flex items-center gap-2 bg-sunbeam/10 border border-sunbeam/30 rounded-full px-4 py-1.5 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunbeam opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sunbeam"></span>
              </span>
              <span className="text-sm font-medium text-sunbeam">Limited slots available this week</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance mb-6">
              See It <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">Moving</span> In Person
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Words and videos can only show so much. Book a live demo to experience the full impact of kinetic LED displays.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sunbeam" />
                <span>No obligation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sunbeam" />
                <span>30-min session</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sunbeam" />
                <span>Custom solutions discussed</span>
              </div>
            </div>
          </div>
        ) : (
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* Urgency badge */}
            <motion.div
              className="inline-flex items-center gap-2 bg-sunbeam/10 border border-sunbeam/30 rounded-full px-4 py-1.5 mb-6"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sunbeam opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-sunbeam"></span>
              </span>
              <span className="text-sm font-medium text-sunbeam">Limited slots available this week</span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance mb-6">
              See It <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunbeam via-amber to-solar">Moving</span> In Person
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
              Words and videos can only show so much. Book a live demo to experience the full impact of kinetic LED displays.
            </p>

            {/* Value props */}
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sunbeam" />
                <span>No obligation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sunbeam" />
                <span>30-min session</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-sunbeam" />
                <span>Custom solutions discussed</span>
              </div>
            </div>
          </motion.div>
        )}

        <div className="max-w-4xl mx-auto">
          {step === "select" && (
            isMobile ? (
              <div>
                <Card className="p-4 sm:p-6 md:p-8 bg-card">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Calendar className="h-5 w-5 text-sunbeam" />
                    <h3 className="text-lg sm:text-xl font-bold">Select a Time Slot</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                    {availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => slot.available && handleSlotSelect(slot.date, slot.time)}
                        disabled={!slot.available}
                        className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-colors active:scale-[0.98] ${
                          slot.available
                            ? "border-border hover:border-sunbeam bg-background"
                            : "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                        }`}
                      >
                        {slot.popular && slot.available && (
                          <span className="absolute -top-2 -right-2 bg-sunbeam text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <p className="font-semibold text-sm sm:text-base mb-1">{slot.date}</p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </div>
                        {!slot.available && <p className="text-xs text-destructive mt-1 sm:mt-2">Booked</p>}
                      </button>
                    ))}
                  </div>

                  {/* Urgency note */}
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    <span className="text-sunbeam font-medium">3 slots</span> already booked this week. Secure yours now.
                  </p>
                </Card>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Card className="p-4 sm:p-6 md:p-8 bg-card">
                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <Calendar className="h-5 w-5 text-sunbeam" />
                    <h3 className="text-lg sm:text-xl font-bold">Select a Time Slot</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                    {availableSlots.map((slot, index) => (
                      <motion.button
                        key={index}
                        onClick={() => slot.available && handleSlotSelect(slot.date, slot.time)}
                        disabled={!slot.available}
                        className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                          slot.available
                            ? "border-border hover:border-sunbeam hover:shadow-lg bg-background"
                            : "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                        }`}
                        whileHover={slot.available ? { scale: 1.03 } : {}}
                        whileTap={slot.available ? { scale: 0.98 } : {}}
                      >
                        {slot.popular && slot.available && (
                          <span className="absolute -top-2 -right-2 bg-sunbeam text-black text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                        <p className="font-semibold text-sm sm:text-base mb-1">{slot.date}</p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {slot.time}
                        </div>
                        {!slot.available && <p className="text-xs text-destructive mt-1 sm:mt-2">Booked</p>}
                      </motion.button>
                    ))}
                  </div>

                  {/* Urgency note */}
                  <p className="text-center text-sm text-muted-foreground mt-6">
                    <span className="text-sunbeam font-medium">3 slots</span> already booked this week. Secure yours now.
                  </p>
                </Card>
              </motion.div>
            )
          )}

          {step === "form" && selectedSlot && (
            isMobile ? (
              <div>
                <Card className="p-4 sm:p-6 md:p-8 bg-card">
                  <div className="mb-6">
                    <button
                      onClick={() => setStep("select")}
                      className="text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                      ← Back to calendar
                    </button>
                    <h3 className="text-xl font-bold mb-2">Your Details</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedSlot.date}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{selectedSlot.time}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="10-digit phone number"
                        maxLength={10}
                      />
                      {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">What Experience Are You Looking For?</Label>
                      <Input
                        id="purpose"
                        required
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Museum installation, corporate lobby, exhibition, etc."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-gradient-to-r from-sunbeam to-amber text-black font-bold hover:shadow-[0_0_30px_rgba(255,204,1,0.4)] transition-all"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        "Confirm My Demo Slot"
                      )}
                    </Button>
                  </form>
                </Card>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
                <Card className="p-4 sm:p-6 md:p-8 bg-card">
                  <div className="mb-6">
                    <button
                      onClick={() => setStep("select")}
                      className="text-sm text-muted-foreground hover:text-foreground mb-4"
                    >
                      ← Back to calendar
                    </button>
                    <h3 className="text-xl font-bold mb-2">Your Details</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedSlot.date}</span>
                      <span>•</span>
                      <Clock className="h-4 w-4" />
                      <span>{selectedSlot.time}</span>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        placeholder="10-digit phone number"
                        maxLength={10}
                      />
                      {phoneError && <p className="text-sm text-destructive">{phoneError}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="purpose">What Experience Are You Looking For?</Label>
                      <Input
                        id="purpose"
                        required
                        value={formData.purpose}
                        onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                        placeholder="Museum installation, corporate lobby, exhibition, etc."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={isSubmitting}
                      className="w-full rounded-full bg-gradient-to-r from-sunbeam to-amber text-black font-bold hover:shadow-[0_0_30px_rgba(255,204,1,0.4)] transition-all relative overflow-hidden"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <motion.span
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: ["-100%", "200%"] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          />
                          <span className="relative">Confirm My Demo Slot</span>
                        </>
                      )}
                    </Button>
                  </form>
                </Card>
              </motion.div>
            )
          )}

          {step === "confirmation" && selectedSlot && (
            isMobile ? (
              <div>
                <Card className="p-6 sm:p-8 md:p-12 bg-card text-center">
                  <div className="mb-4 sm:mb-6 flex justify-center mobile-scale-in">
                    <div className="bg-sunbeam/20 rounded-full p-3 sm:p-4">
                      <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-sunbeam" />
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Booking Confirmed!</h3>
                  <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                    We'll get in touch with you soon.
                  </p>

                  <div className="bg-sunbeam/10 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto border border-sunbeam/20">
                    <div className="grid gap-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold">{selectedSlot.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-semibold">{selectedSlot.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setStep("select")
                      setSelectedSlot(null)
                      setFormData({ name: "", email: "", phone: "", purpose: "" })
                    }}
                    variant="outline"
                    className="rounded-full"
                  >
                    Book Another Demo
                  </Button>
                </Card>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="p-6 sm:p-8 md:p-12 bg-card text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-4 sm:mb-6 flex justify-center"
                  >
                    <div className="bg-sunbeam/20 rounded-full p-3 sm:p-4">
                      <CheckCircle2 className="h-12 w-12 sm:h-16 sm:w-16 text-sunbeam" />
                    </div>
                  </motion.div>

                  <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Booking Confirmed!</h3>
                  <p className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8">
                    We'll get in touch with you soon.
                  </p>

                  <div className="bg-sunbeam/10 rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-md mx-auto border border-sunbeam/20">
                    <div className="grid gap-3 text-left">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-semibold">{selectedSlot.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-semibold">{selectedSlot.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-semibold">{formData.name}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setStep("select")
                      setSelectedSlot(null)
                      setFormData({ name: "", email: "", phone: "", purpose: "" })
                    }}
                    variant="outline"
                    className="rounded-full"
                  >
                    Book Another Demo
                  </Button>
                </Card>
              </motion.div>
            )
          )}
        </div>
      </div>
    </section>
  )
}

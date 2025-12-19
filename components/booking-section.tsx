"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, CheckCircle2 } from "lucide-react"

const availableSlots = [
  { date: "2025-01-15", time: "10:00 AM", available: true },
  { date: "2025-01-15", time: "2:00 PM", available: true },
  { date: "2025-01-16", time: "9:00 AM", available: false },
  { date: "2025-01-16", time: "11:00 AM", available: true },
  { date: "2025-01-16", time: "3:00 PM", available: true },
  { date: "2025-01-17", time: "10:00 AM", available: true },
  { date: "2025-01-17", time: "1:00 PM", available: true },
  { date: "2025-01-17", time: "4:00 PM", available: false },
]

export default function BookingSection() {
  const [step, setStep] = useState<"select" | "form" | "confirmation">("select")
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", purpose: "" })

  const handleSlotSelect = (date: string, time: string) => {
    setSelectedSlot({ date, time })
    setStep("form")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep("confirmation")
  }

  return (
    <section id="booking" className="py-24 md:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-sm uppercase tracking-wider text-amber mb-4 font-semibold">Transform Your Space</p>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance mb-6">Ready to Transform?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
            If you can imagine the experience, Craftech 360 is the partner that engineers it. Book a visit to see our
            kinetic installations in action.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {step === "select" && (
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
                      className={`p-3 sm:p-4 rounded-xl border-2 text-left transition-all ${
                        slot.available
                          ? "border-border hover:border-sunbeam hover:shadow-lg bg-background"
                          : "border-border bg-muted/50 opacity-50 cursor-not-allowed"
                      }`}
                      whileHover={slot.available ? { scale: 1.03 } : {}}
                      whileTap={slot.available ? { scale: 0.98 } : {}}
                    >
                      <p className="font-semibold text-sm sm:text-base mb-1">{slot.date}</p>
                      <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {slot.time}
                      </div>
                      {!slot.available && <p className="text-xs text-destructive mt-1 sm:mt-2">Unavailable</p>}
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          )}

          {step === "form" && selectedSlot && (
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
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+1 (555) 000-0000"
                    />
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

                  <Button type="submit" size="lg" className="w-full rounded-full">
                    Confirm Booking
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {step === "confirmation" && selectedSlot && (
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
                  We've sent a confirmation email to <strong>{formData.email}</strong>
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
          )}
        </div>
      </div>
    </section>
  )
}

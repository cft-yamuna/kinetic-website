"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { href: "#products", label: "Products" },
    { href: "#about", label: "About" },
    { href: "#booking", label: "Book Demo" },
  ]

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-lg border-b border-border" : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center">
              <Image
                src={isScrolled ? "/images/layer-202.png" : "/images/logowhite.png"}
                alt="Craftech 360"
                width={180}
                height={50}
                className="h-10 w-auto transition-opacity duration-300"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? "text-muted-foreground hover:text-foreground" : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="#booking">
                <Button size="lg" className="rounded-full bg-sunbeam text-black hover:bg-amber relative overflow-hidden group">
                  <span className="relative z-10">Book a Visit</span>
                  <span className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                  <span className="absolute -inset-1 bg-sunbeam/50 blur-md opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                </Button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden ${isScrolled ? "text-foreground" : "text-white"}`}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-background md:hidden"
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-medium text-foreground"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Link href="#booking" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button
                    size="lg"
                    className="rounded-full bg-sunbeam text-black hover:bg-amber relative overflow-hidden"
                  >
                    <span className="relative z-10">Book a Visit</span>
                    <span className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

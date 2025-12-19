import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Image
              src="/images/layer-202.png"
              alt="Craftech 360"
              width={200}
              height={55}
              className="h-12 w-auto mb-4"
            />
            <p className="text-sunbeam mb-2 text-lg font-medium">Engage, Create, Remember</p>
            <p className="text-white/70 mb-6 leading-relaxed max-w-md">
              Engineering emotion and crafting unforgettable experiences. From Bengaluru to the world, transforming
              spaces into immersive stories.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-sunbeam transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-sunbeam transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-sunbeam transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-sunbeam transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber">Experiences</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Museums & Galleries
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Corporate Spaces
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Exhibitions
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Permanent Installations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-amber">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/70">© 2025 Craftech 360. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-white/70 hover:text-sunbeam transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

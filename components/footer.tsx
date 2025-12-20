import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12 md:py-16 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Image
            src="/images/logowhite.png"
            alt="Craftech 360"
            width={200}
            height={55}
            className="h-12 w-auto mb-4"
          />
          <p className="text-sunbeam mb-2 text-lg font-medium">Engage, Create, Remember</p>
          <p className="text-white/70 mb-6 leading-relaxed max-w-lg">
            Engineering emotion and crafting unforgettable experiences. From Bengaluru to the world, transforming
            spaces into immersive stories.
          </p>
          <div className="flex gap-5">
            <a href="https://www.facebook.com/profile.php?id=61579177028158" target="_blank" rel="noopener noreferrer" className="hover:text-sunbeam transition-colors" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="https://twitter.com/craftech360" target="_blank" rel="noopener noreferrer" className="hover:text-sunbeam transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="https://instagram.com/craftech360" target="_blank" rel="noopener noreferrer" className="hover:text-sunbeam transition-colors" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
            <a href="https://www.linkedin.com/company/craftech360/" target="_blank" rel="noopener noreferrer" className="hover:text-sunbeam transition-colors" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

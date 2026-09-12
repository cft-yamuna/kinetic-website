import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Craftech 360 - Engineering Emotion, Crafting Unforgettable Experiences",
  description:
    "We create living experiences through kinetic installations, holograms, and immersive displays. From museums to corporate spaces, transforming spaces into unforgettable stories. 950+ experiences across 17 cities in 5 countries.",
  generator: "v0.app",
  icons: {
    icon: "/apple-icon.png",
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}

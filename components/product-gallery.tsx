"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import type { GalleryImage } from "@/lib/gallery-images"

type Row = { items: number[]; height: number }

// Share the images out across `rowCount` rows so each row's combined aspect
// ratio is as even as possible - then every row fills the width at a similar
// height. Widest images are placed first, each into the row with the least in
// it so far; within a row the images keep their listed order.
function partitionRows(ratios: number[], rowCount: number): number[][] {
  const rows = Array.from({ length: rowCount }, () => ({ items: [] as number[], total: 0 }))
  const widestFirst = ratios.map((_, i) => i).sort((a, b) => ratios[b] - ratios[a])
  for (const i of widestFirst) {
    const row = rows.reduce((least, candidate) => (candidate.total < least.total ? candidate : least))
    row.items.push(i)
    row.total += ratios[i]
  }
  return rows
    .map((row) => row.items.sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0])
}

function buildRows(ratios: number[], width: number, targetHeight: number, gap: number): Row[] {
  if (ratios.length === 0 || width <= 0) return []
  const totalRatio = ratios.reduce((sum, r) => sum + r, 0)
  const rowCount = Math.min(ratios.length, Math.max(1, Math.round((totalRatio * targetHeight) / width)))

  return partitionRows(ratios, rowCount).map((items) => {
    const rowRatio = items.reduce((sum, i) => sum + ratios[i], 0)
    const fullWidthHeight = (width - gap * (items.length - 1)) / rowRatio
    // A row with too few images would blow up to fill the width - cap it and centre it instead
    return { items, height: Math.min(fullWidthHeight, targetHeight * 1.6) }
  })
}

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" })
  const [gridWidth, setGridWidth] = useState(1280)

  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const observer = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width))
    observer.observe(grid)
    return () => observer.disconnect()
  }, [])

  const gap = gridWidth < 768 ? 12 : 16
  const targetHeight = gridWidth < 640 ? 170 : gridWidth < 1024 ? 240 : gridWidth < 1280 ? 340 : 400
  const ratios = useMemo(() => images.map((image) => image.width / image.height), [images])
  const rows = useMemo(() => buildRows(ratios, gridWidth, targetHeight, gap), [ratios, gridWidth, targetHeight, gap])

  if (images.length === 0) return null

  return (
    <section ref={sectionRef} id="gallery" className="relative bg-black py-16 md:py-24 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-sunbeam/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-amber/5 rounded-full blur-[120px]" />

      <div className="container relative mx-auto px-4">
        {/* Header */}
        <div className="mb-10 md:mb-14 max-w-3xl">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
          >
            <span className="w-12 h-px bg-sunbeam" />
            <span className="text-sunbeam text-xs font-bold tracking-[0.25em] uppercase">
              Product Gallery
            </span>
          </motion.div>
          <motion.h2
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1]"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Built For Real.{" "}
            <span className="whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-sunbeam to-amber">
              Seen Live.
            </span>
          </motion.h2>
        </div>

        {/* Justified rows - every image keeps its own shape */}
        <div ref={gridRef} className="flex flex-col" style={{ gap }}>
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center" style={{ gap }}>
              {row.items.map((i) => (
                <motion.div
                  key={images[i].src}
                  className="group relative shrink overflow-hidden rounded-2xl border border-white/10 bg-neutral-950"
                  style={{ width: ratios[i] * row.height, height: row.height }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.08 }}
                >
                  <Image
                    src={images[i].src}
                    alt={`${images[i].product} by Craftech 360`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Product name */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent px-3 pb-2.5 pt-8 md:px-4 md:pb-3.5">
                    <span className="flex items-center gap-1.5 md:gap-2 whitespace-nowrap text-[10px] md:text-sm font-bold uppercase tracking-[0.06em] md:tracking-[0.15em] text-white">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sunbeam" />
                      {images[i].product}
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-sunbeam/0 transition duration-500 group-hover:ring-sunbeam/40" />
                </motion.div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

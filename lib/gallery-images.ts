import fs from "fs"
import path from "path"

export type GalleryImage = { src: string; product: string; width: number; height: number }

// One photo per product, shown in this order. Files live in public/images;
// width and height are read from the file, so any size or shape works.
// Still to come: Flap
const GALLERY_PHOTOS = [
  { product: "The Orbit", file: "gallery-orbit.jpg" },
  { product: "HRMS", file: "gallery-hrms.jpg" },
  { product: "Helix", file: "gallery-helix.jpg" },
  { product: "Tri-Block", file: "gallery-tri-block.jpg" },
  { product: "Telescopic", file: "gallery-telescopic.jpg" },
  { product: "DNA", file: "gallery-dna.jpg" },
  { product: "Nova Spin", file: "gallery-nova-spin.jpg" },
]
const IMAGES_DIR = path.join(process.cwd(), "public", "images")

type Size = { width: number; height: number }

// Photos from phones are often stored sideways with an EXIF orientation flag;
// browsers rotate them on display, so the stored width/height are swapped
function jpegOrientation(buf: Buffer, segment: number): number {
  if (buf.toString("ascii", segment + 4, segment + 8) !== "Exif") return 1
  const tiff = segment + 10
  const little = buf.toString("ascii", tiff, tiff + 2) === "II"
  const read16 = (o: number) => (little ? buf.readUInt16LE(o) : buf.readUInt16BE(o))
  const read32 = (o: number) => (little ? buf.readUInt32LE(o) : buf.readUInt32BE(o))
  const ifd = tiff + read32(tiff + 4)
  const entries = read16(ifd)
  for (let i = 0; i < entries; i++) {
    const entry = ifd + 2 + i * 12
    if (read16(entry) === 0x0112) return read16(entry + 8)
  }
  return 1
}

function readJpegSize(buf: Buffer): Size | null {
  let orientation = 1
  let offset = 2
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) return null
    const marker = buf[offset + 1]
    const length = buf.readUInt16BE(offset + 2)
    if (marker === 0xe1) orientation = jpegOrientation(buf, offset)
    // Start-of-frame markers carry the dimensions (C4, C8 and CC are not frames)
    if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
      const height = buf.readUInt16BE(offset + 5)
      const width = buf.readUInt16BE(offset + 7)
      return orientation >= 5 ? { width: height, height: width } : { width, height }
    }
    offset += 2 + length
  }
  return null
}

function readImageSize(buf: Buffer): Size | null {
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
  }
  if (buf[0] === 0xff && buf[1] === 0xd8) return readJpegSize(buf)
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16)
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) }
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff }
    if (chunk === "VP8L") {
      const bits = buf.readUInt32LE(21)
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }
    }
  }
  return null
}

export function getGalleryImages(): GalleryImage[] {
  return GALLERY_PHOTOS.flatMap(({ product, file }) => {
    const filePath = path.join(IMAGES_DIR, file)
    if (!fs.existsSync(filePath)) return []
    const size = readImageSize(fs.readFileSync(filePath))
    if (!size || !size.width || !size.height) return []
    return [{ src: `/images/${encodeURIComponent(file)}`, product, ...size }]
  })
}

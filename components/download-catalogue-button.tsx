"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export const CATALOGUE_URL =
  "https://undgsjkhdoycsqpelcho.supabase.co/storage/v1/object/public/uploads/Kinetic-Catelogue.pdf"

const FILE_NAME = "Kinetic-Catalogue.pdf"

type DownloadCatalogueButtonProps = {
  className?: string
  size?: "sm" | "lg" | "default" | "icon"
  variant?: "default" | "outline" | "ghost" | "secondary" | "link" | "destructive"
  label?: string
  /** Also open the PDF in a new tab after the download starts */
  openAfterDownload?: boolean
  onClick?: () => void
}

export default function DownloadCatalogueButton({
  className,
  size = "lg",
  variant = "outline",
  label = "Download Catalogue",
  openAfterDownload = true,
  onClick,
}: DownloadCatalogueButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    onClick?.()
    if (isDownloading) return
    setIsDownloading(true)

    try {
      const response = await fetch(CATALOGUE_URL)
      if (!response.ok) throw new Error(`Request failed: ${response.status}`)

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = blobUrl
      link.download = FILE_NAME
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Open the downloaded file itself, not the remote link
      if (openAfterDownload) {
        window.open(blobUrl, "_blank", "noopener,noreferrer")
      }

      // Revoke once the download has started and the viewer tab has loaded it
      setTimeout(() => URL.revokeObjectURL(blobUrl), 60000)
    } catch {
      // Fall back to letting the browser handle the file directly
      window.open(CATALOGUE_URL, "_blank", "noopener,noreferrer")
    } finally {
      setIsDownloading(false)
    }
  }

  const iconClass = size === "sm" ? "mr-1.5 h-4 w-4" : "mr-2 h-5 w-5"

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleDownload}
      disabled={isDownloading}
      aria-label={label}
      className={cn("rounded-full", className)}
    >
      {isDownloading ? (
        <Loader2 className={cn("animate-spin", iconClass)} />
      ) : (
        <Download className={iconClass} />
      )}
      {label}
    </Button>
  )
}

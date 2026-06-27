'use client'
import { useEffect, useState } from 'react'
import { getColor } from 'colorthief'

const FALLBACK = 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)'

export default function ColorBackdrop({ coverUrl }: { coverUrl: string | null }) {
  const [bg, setBg] = useState<string>(FALLBACK)

  useEffect(() => {
    if (!coverUrl) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = coverUrl
    img.onload = () => {
      try {
        const [r, g, b] = getColor(img)
        setBg(
          `radial-gradient(ellipse 90% 70% at 50% 0%, rgba(${r},${g},${b},0.85) 0%, rgba(${r},${g},${b},0.35) 35%, #14101f 65%, #0A0612 100%)`
        )
      } catch {
        setBg(FALLBACK)
      }
    }
    img.onerror = () => setBg(FALLBACK)
  }, [coverUrl])

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-1000"
      style={{ background: bg }}
    />
  )
}

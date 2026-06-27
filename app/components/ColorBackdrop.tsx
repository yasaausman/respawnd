'use client'
import { useEffect, useState } from 'react'
import { getColor } from 'colorthief'

const BASE = 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)'

export default function ColorBackdrop({ coverUrl }: { coverUrl: string | null }) {
  const [bg, setBg] = useState<string>(BASE)

  useEffect(() => {
    if (!coverUrl) return
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = coverUrl
    img.onload = () => {
      try {
        const [r, g, b] = getColor(img)
        // cover color as a subtle accent glow layered OVER the violet base
        setBg(
          `radial-gradient(ellipse 70% 50% at 50% 0%, rgba(${r},${g},${b},0.28) 0%, transparent 55%), ${BASE}`
        )
      } catch {
        setBg(BASE)
      }
    }
    img.onerror = () => setBg(BASE)
  }, [coverUrl])

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 transition-[background] duration-1000"
      style={{ background: bg }}
    />
  )
}

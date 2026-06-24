'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

type Game = {
  id: number
  name: string
  background_image: string | null
  released: string | null
  genres: { id: number; name: string; slug: string }[]
  rating?: number
  metacritic?: number
}

export default function Top250Page() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/api/top250`)
      .then(r => r.json())
      .then(d => {
        setGames(d.results.filter((g: Game) => g.background_image))
        setLoading(false)
      })
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)' }}>
      <p className="text-violet-400 text-lg animate-pulse">Loading top 250...</p>
    </div>
  )

  return (
    <main className="min-h-screen text-zinc-100 px-6 py-10" style={{ background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/discover" className="text-zinc-400 hover:text-zinc-100 transition cursor-none text-sm">← Back</Link>
          <h1 className="text-3xl font-bold">🏆 Top 250 Games</h1>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {games.map((game, i) => (
            <Link key={game.id} href={`/games/${game.id}`} className="group cursor-none">
              <div className="relative h-48 w-full overflow-hidden rounded-lg">
                <Image src={game.background_image!} alt={game.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-1 left-1 bg-violet-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">
                  #{i + 1}
                </div>
              </div>
              <p className="mt-1 text-xs text-zinc-400 line-clamp-1 group-hover:text-zinc-100 transition-colors">{game.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
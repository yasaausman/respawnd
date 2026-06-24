'use client'

import { useState, useEffect, useRef } from 'react'
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

function GameCard({ game, rank }: { game: Game; rank?: number }) {
  return (
    <Link href={`/games/${game.id}`} className="group relative flex-shrink-0 w-44 cursor-none">
      <div className="relative h-60 w-44 overflow-hidden rounded-lg">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-500 text-xs">No image</span>
          </div>
        )}
        {rank && (
          <div className="absolute top-2 left-2 bg-violet-600 text-white text-xs font-bold px-2 py-1 rounded">
            #{rank}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
          <p className="text-white text-xs font-semibold line-clamp-2">{game.name}</p>
          {game.rating && <p className="text-violet-300 text-xs">★ {game.rating.toFixed(1)}</p>}
        </div>
      </div>
      <p className="mt-2 text-xs text-zinc-400 line-clamp-1 group-hover:text-zinc-100 transition-colors">{game.name}</p>
    </Link>
  )
}

function HorizontalSlider({ games, showRank }: { games: Game[]; showRank?: boolean }) {
  return (
    <div className="flex gap-20 overflow-x-auto pb-4 scrollbar-hide justify-center">
      {games.map((game, i) => (
        <GameCard key={game.id} game={game} rank={showRank ? i + 1 : undefined} />
      ))}
    </div>
  )
}

// Filter out DLC/expansions — keep only games with metacritic >= 80 and a cover image
function filterTopGames(games: Game[]) {
  return games.filter(g => g.background_image && g.metacritic && g.metacritic >= 80)
}

const PINNED_IDS = [28, 3498, 3636, 58175, 3328]

export default function DiscoverPage() {
  const [top250, setTop250] = useState<Game[]>([])
  const [upcoming, setUpcoming] = useState<Game[]>([])
  const [genres, setGenres] = useState<{ id: number; name: string; slug: string }[]>([])
  const [genreGames, setGenreGames] = useState<Game[]>([])
  const [activeGenre, setActiveGenre] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      Promise.all(PINNED_IDS.map(id => fetch(`${API}/api/game/${id}`).then(r => r.json()))),
      fetch(`${API}/api/upcoming`).then(r => r.json()),
      fetch(`${API}/api/genres`).then(r => r.json()),
    ]).then(([t, u, g]) => {
      setTop250(t.filter((g: Game) => g.background_image))
      setUpcoming(u.results.filter((g: Game) => g.background_image))
      setGenres(g.results)
      if (g.results[0]) {
        setActiveGenre(g.results[0].slug)
        fetch(`${API}/api/games/genre/${g.results[0].slug}`)
          .then(r => r.json())
          .then(d => setGenreGames(d.results.filter((g: Game) => g.background_image)))
      }
      setLoading(false)
    })
  }, [])

  const handleGenre = (slug: string) => {
    setActiveGenre(slug)
    setGenreGames([])
    fetch(`${API}/api/games/genre/${slug}`)
      .then(r => r.json())
      .then(d => setGenreGames(d.results.filter((g: Game) => g.background_image)))
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)' }}>
      <p className="text-violet-400 text-lg animate-pulse">Loading games...</p>
    </div>
  )

  return (
    <main className="min-h-screen text-zinc-100 px-6 py-10" style={{ background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)' }}>

      {/* Top 5 Slider */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🏆 Top Rated Games</h2>
          <Link href="/discover/top250" className="text-sm text-violet-400 hover:text-violet-300 transition cursor-none">
            See all 250 →
          </Link>
        </div>
        <HorizontalSlider games={top250.slice(0, 5)} showRank />
      </section>

      {/* Top by Genre */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">🎯 Browse by Genre</h2>
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {genres.map(g => (
            <button
              key={g.id}
              onClick={() => handleGenre(g.slug)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-none ${
                activeGenre === g.slug
                  ? 'bg-violet-600 text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
        {genreGames.length > 0 ? (
          <HorizontalSlider games={genreGames.slice(0, 5)} />
        ) : (
          <p className="text-zinc-500 text-center animate-pulse">Loading...</p>
        )}
      </section>

      {/* New & Upcoming */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">🚀 New & Upcoming</h2>
        <HorizontalSlider games={upcoming.slice(0, 5)} />
      </section>

    </main>
  )
}
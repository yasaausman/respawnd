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

function GameCard({ game, rank }: { game: Game; rank?: number }) {
  return (
    <Link href={`/games/${game.id}`} className="group relative flex-shrink-0 w-44 cursor-none">
      <div className="relative h-60 w-44 overflow-hidden rounded-lg">
        {game.background_image ? (
          <Image
            src={game.background_image}
            alt={game.name}
            fill
            loading="lazy"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full bg-white/5 flex items-center justify-center">
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

function CardSkeleton() {
  return (
    <div className="flex-shrink-0 w-44 animate-pulse">
      <div className="h-60 w-44 rounded-lg bg-white/10" />
      <div className="mt-2 h-3 w-3/4 rounded bg-white/10" />
    </div>
  )
}

function HorizontalSlider({ games, showRank, loading }: { games: Game[]; showRank?: boolean; loading?: boolean }) {
  if (loading) {
    return (
      <div className="flex gap-20 overflow-x-auto pb-4 scrollbar-hide justify-center">
        {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    )
  }
  return (
    <div className="flex gap-20 overflow-x-auto pb-4 scrollbar-hide justify-center">
      {games.map((game, i) => (
        <GameCard key={game.id} game={game} rank={showRank ? i + 1 : undefined} />
      ))}
    </div>
  )
}

const PINNED_IDS = [28, 3498, 3636, 58175, 3328]

type Article = {
  title: string
  description: string | null
  url: string
  image: string | null
  published_at: string | null
  source: string | null
}

function NewsCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null
  return (
    <a
    
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex-shrink-0 w-72 cursor-none overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-violet-500/40 hover:bg-white/[0.06]"
    >
      <div className="relative h-40 w-full overflow-hidden bg-white/5">
        {article.image && (
          <img
            src={article.image}
            alt={article.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] text-violet-300/80">
          {article.source && <span>{article.source}</span>}
          {article.source && date && <span className="text-zinc-600">•</span>}
          {date && <span className="text-zinc-500">{date}</span>}
        </div>
        <h3 className="line-clamp-2 text-sm font-semibold text-zinc-100 group-hover:text-white">{article.title}</h3>
        {article.description && (
          <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">{article.description}</p>
        )}
      </div>
    </a>
  )
}

function NewsSkeleton() {
  return (
    <div className="w-72 flex-shrink-0 animate-pulse overflow-hidden rounded-xl border border-white/10 bg-white/[0.03]">
      <div className="h-40 w-full bg-white/10" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-1/3 rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-3 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  )
}

export default function DiscoverPage() {
  const [top250, setTop250] = useState<Game[]>([])
  const [upcoming, setUpcoming] = useState<Game[]>([])
  const [genres, setGenres] = useState<{ id: number; name: string; slug: string }[]>([])
  const [genreGames, setGenreGames] = useState<Game[]>([])
  const [activeGenre, setActiveGenre] = useState<string>('')
  const [loadingTop, setLoadingTop] = useState(true)
  const [loadingUpcoming, setLoadingUpcoming] = useState(true)
  const [loadingGenre, setLoadingGenre] = useState(true)
  const [news, setNews] = useState<Article[]>([])
  const [loadingNews, setLoadingNews] = useState(true)

  useEffect(() => {
    Promise.all(PINNED_IDS.map(id => fetch(`${API}/api/game/${id}`).then(r => r.json())))
      .then(games => {
        setTop250(games.filter((g: Game) => g.background_image))
        setLoadingTop(false)
      })

    fetch(`${API}/api/upcoming`)
      .then(r => r.json())
      .then(d => {
        setUpcoming(d.results.filter((g: Game) => g.background_image))
        setLoadingUpcoming(false)
      })

    fetch(`${API}/api/news`)
      .then(r => r.json())
      .then(d => {
        setNews(d.articles ?? [])
        setLoadingNews(false)
      })
      .catch(() => setLoadingNews(false))

    fetch(`${API}/api/genres`)
      .then(r => r.json())
      .then(d => {
        setGenres(d.results)
        if (d.results[0]) {
          setActiveGenre(d.results[0].slug)
          fetch(`${API}/api/games/genre/${d.results[0].slug}`)
            .then(r => r.json())
            .then(g => {
              setGenreGames(g.results.filter((g: Game) => g.background_image))
              setLoadingGenre(false)
            })
        }
      })
  }, [])

  const handleGenre = (slug: string) => {
    setActiveGenre(slug)
    setLoadingGenre(true)
    fetch(`${API}/api/games/genre/${slug}`)
      .then(r => r.json())
      .then(d => {
        setGenreGames(d.results.filter((g: Game) => g.background_image))
        setLoadingGenre(false)
      })
  }

  return (
    <main className="min-h-screen text-zinc-100 px-6 py-10" style={{ background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)' }}>

      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">🏆 Top Rated Games</h2>
          <Link href="/discover/top250" className="text-sm text-violet-400 hover:text-violet-300 transition cursor-none">
            See all 250 →
          </Link>
        </div>
        <HorizontalSlider games={top250.slice(0, 5)} showRank loading={loadingTop} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">🎯 Browse by Genre</h2>
        <div className="flex gap-2 flex-wrap justify-center mb-6">
          {genres.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-8 w-20 rounded-full bg-white/10 animate-pulse" />
              ))
            : genres.map(g => (
                <button
                  key={g.id}
                  onClick={() => handleGenre(g.slug)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition cursor-none ${
                    activeGenre === g.slug
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                  }`}
                >
                  {g.name}
                </button>
              ))}
        </div>
        <HorizontalSlider games={genreGames.slice(0, 5)} loading={loadingGenre} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">🚀 New & Upcoming</h2>
        <HorizontalSlider games={upcoming.slice(0, 5)} loading={loadingUpcoming} />
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">📰 Gaming News</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {loadingNews
            ? Array.from({ length: 4 }).map((_, i) => <NewsSkeleton key={i} />)
            : news.map((a, i) => <NewsCard key={i} article={a} />)}
        </div>
      </section>

    </main>
  )
}

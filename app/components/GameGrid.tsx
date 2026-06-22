'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { SearchResult } from '@/app/lib/data'
import { POPULAR_GAMES } from '@/app/lib/data'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

async function searchGames(q: string): Promise<SearchResult[]> {
  const res = await fetch(
    `${API_BASE}/api/search?q=${encodeURIComponent(q)}`
  )
  if (!res.ok) throw new Error('Search failed')
  const data = await res.json()
  return data.results as SearchResult[]
}

async function fetchPopularGames(): Promise<SearchResult[]> {
  const settled = await Promise.allSettled(
    POPULAR_GAMES.map(({ name }) =>
      searchGames(name).then((results) => results[0] ?? null)
    )
  )
  return settled
    .filter((r) => r.status === 'fulfilled' && r.value != null)
    .map((r) => (r as PromiseFulfilledResult<SearchResult>).value)
}

function SkeletonCard() {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900">
      <div className="aspect-[3/4] w-full bg-zinc-800" />
      <div className="p-3">
        <div className="h-4 rounded bg-zinc-700" />
        <div className="mt-2 h-3 w-1/2 rounded bg-zinc-800" />
      </div>
    </div>
  )
}

export default function GameGrid() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const loadGames = async (q: string) => {
    setLoading(true)
    setError(null)
    try {
      setResults(q ? await searchGames(q) : await fetchPopularGames())
    } catch {
      setError('Could not reach the backend. Make sure the API is running.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGames('')
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => loadGames(value), 400)
  }

  return (
    <div>
      {/* Search bar */}
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-10 text-zinc-100 placeholder-zinc-500 outline-none ring-violet-600 transition focus:ring-2"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Spinner while loading */}
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-700 border-t-violet-500" />
          </div>
        )}
        {/* Clear button when idle with a query */}
        {!loading && query && (
          <button
            onClick={() => handleSearch('')}
            aria-label="Clear search"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Skeleton grid */}
      {loading && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && !error && (
        <>
          {results.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-zinc-400">
                No results for{' '}
                <span className="text-zinc-200">"{query}"</span>
              </p>
              <button
                onClick={() => handleSearch('')}
                className="mt-3 text-sm text-violet-400 transition-colors hover:text-violet-300"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {results.map((game) => (
                <Link
                  key={game.id}
                  href={`/games/${game.id}`}
                  className="group"
                >
                  <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-200 group-hover:border-violet-600/60 group-hover:shadow-xl group-hover:shadow-violet-950/30">
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-800">
                      {game.background_image ? (
                        <Image
                          src={game.background_image}
                          alt={game.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center px-2 text-center text-xs text-zinc-600">
                          {game.name}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">
                        {game.name}
                      </h3>
                      <p className="mt-1 text-xs text-zinc-500">
                        {game.released?.split('-')[0] ?? '—'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

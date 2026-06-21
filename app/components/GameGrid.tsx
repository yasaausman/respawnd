'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Game } from '@/app/lib/data'

export default function GameGrid({ games }: { games: Game[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim()
    ? games.filter((g) =>
        g.title.toLowerCase().includes(query.toLowerCase())
      )
    : games

  return (
    <div>
      <div className="relative mb-8">
        <input
          type="text"
          placeholder="Search games..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-3 pl-12 pr-5 text-zinc-100 placeholder-zinc-500 outline-none ring-violet-600 transition focus:ring-2"
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
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-zinc-400">
            No games found for{' '}
            <span className="text-zinc-200">"{query}"</span>
          </p>
          <button
            onClick={() => setQuery('')}
            className="mt-3 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtered.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`} className="group">
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition-all duration-200 group-hover:border-violet-600/60 group-hover:shadow-xl group-hover:shadow-violet-950/30">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-800">
                  <Image
                    src={game.coverUrl}
                    alt={game.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1280px) 25vw, 20vw"
                  />
                </div>
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-100">
                    {game.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-500">
                    {game.releaseDate.split('-')[0]}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

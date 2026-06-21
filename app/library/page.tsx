'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { LOGGED_GAMES } from '@/app/lib/data'
import type { Status } from '@/app/lib/data'

const STATUS_STYLES: Record<Status, string> = {
  Played: 'border-emerald-800/50 bg-emerald-900/40 text-emerald-300',
  Playing: 'border-blue-800/50 bg-blue-900/40 text-blue-300',
  Backlog: 'border-amber-800/50 bg-amber-900/40 text-amber-300',
  Want: 'border-violet-800/50 bg-violet-900/40 text-violet-300',
}

const ALL_STATUSES: Status[] = ['Played', 'Playing', 'Backlog', 'Want']

export default function LibraryPage() {
  const [filter, setFilter] = useState<Status | 'All'>('All')

  const filtered =
    filter === 'All'
      ? LOGGED_GAMES
      : LOGGED_GAMES.filter((lg) => lg.status === filter)

  const counts = ALL_STATUSES.reduce<Record<Status, number>>(
    (acc, s) => {
      acc[s] = LOGGED_GAMES.filter((lg) => lg.status === s).length
      return acc
    },
    { Played: 0, Playing: 0, Backlog: 0, Want: 0 }
  )

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">My Library</h1>
        <p className="mt-2 text-zinc-400">
          {LOGGED_GAMES.length} game{LOGGED_GAMES.length !== 1 ? 's' : ''} tracked
        </p>
      </div>

      {/* Stats strip */}
      <div className="mb-6 grid grid-cols-4 gap-3">
        {ALL_STATUSES.map((s) => (
          <div
            key={s}
            className="rounded-xl border border-zinc-800 bg-zinc-900 p-3 text-center"
          >
            <p className="text-xl font-bold text-zinc-100">{counts[s]}</p>
            <p className={`mt-0.5 text-xs font-medium ${STATUS_STYLES[s].split(' ')[2]}`}>
              {s}
            </p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('All')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            filter === 'All'
              ? 'bg-zinc-100 text-zinc-900'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
          }`}
        >
          All ({LOGGED_GAMES.length})
        </button>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              filter === s
                ? 'bg-zinc-100 text-zinc-900'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
            }`}
          >
            {s} ({counts[s]})
          </button>
        ))}
      </div>

      {/* Game list */}
      <div className="flex flex-col gap-3">
        {filtered.map(({ game, status, rating, review }) => (
          <div
            key={game.id}
            className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700"
          >
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-800">
              <Image
                src={game.coverUrl}
                alt={game.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <Link
                  href={`/games/${game.id}`}
                  className="font-semibold text-zinc-100 transition-colors hover:text-violet-400"
                >
                  {game.title}
                </Link>
                {rating > 0 && (
                  <span className="shrink-0 text-sm font-bold text-zinc-300">
                    ★ {rating}
                    <span className="font-normal text-zinc-600">/10</span>
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
                >
                  {status}
                </span>
                <span className="text-xs text-zinc-600">
                  {game.genres.slice(0, 2).join(' · ')}
                </span>
              </div>

              {review && (
                <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                  {review}
                </p>
              )}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-zinc-500">No games with status "{filter}"</p>
            <button
              onClick={() => setFilter('All')}
              className="mt-3 text-sm text-violet-400 transition-colors hover:text-violet-300"
            >
              Show all games
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-zinc-500 transition-colors hover:text-zinc-300"
        >
          Discover more games →
        </Link>
      </div>
    </main>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { GameLog, Status } from '@/app/lib/data'

const API_BASE = 'http://localhost:8000'

const STATUS_STYLES: Record<Status, string> = {
  Played: 'border-emerald-800/50 bg-emerald-900/40 text-emerald-300',
  Playing: 'border-blue-800/50 bg-blue-900/40 text-blue-300',
  Backlog: 'border-amber-800/50 bg-amber-900/40 text-amber-300',
  Want: 'border-violet-800/50 bg-violet-900/40 text-violet-300',
}

const ALL_STATUSES: Status[] = ['Played', 'Playing', 'Backlog', 'Want']

export default function LibraryPage() {
  const [logs, setLogs] = useState<GameLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Status | 'All'>('All')

  useEffect(() => {
    fetch(`${API_BASE}/api/logs`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load library')
        return r.json() as Promise<GameLog[]>
      })
      .then(setLogs)
      .catch(() => setError('Could not reach the backend. Make sure the API is running.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered =
    filter === 'All' ? logs : logs.filter((lg) => lg.status === filter)

  const counts = ALL_STATUSES.reduce<Record<Status, number>>(
    (acc, s) => { acc[s] = logs.filter((lg) => lg.status === s).length; return acc },
    { Played: 0, Playing: 0, Backlog: 0, Want: 0 }
  )

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">My Library</h1>
        {!loading && !error && (
          <p className="mt-2 text-zinc-400">
            {logs.length} game{logs.length !== 1 ? 's' : ''} tracked
          </p>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-800/50 bg-red-950/30 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex animate-pulse items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="h-20 w-14 shrink-0 rounded-lg bg-zinc-800" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-1/2 rounded bg-zinc-700" />
                <div className="h-3 w-1/4 rounded bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && (
        <>
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
              All ({logs.length})
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
            {filtered.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700"
              >
                <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
                  {log.cover_url && (
                    <Image
                      src={log.cover_url}
                      alt={log.title}
                      fill
                      className="object-cover"
                      sizes="56px"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <Link
                      href={`/games/${log.rawg_id}`}
                      className="font-semibold text-zinc-100 transition-colors hover:text-violet-400"
                    >
                      {log.title}
                    </Link>
                    {log.rating != null && log.rating > 0 && (
                      <span className="shrink-0 text-sm font-bold text-zinc-300">
                        ★ {log.rating}
                        <span className="font-normal text-zinc-600">/10</span>
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[log.status as Status]}`}
                    >
                      {log.status}
                    </span>
                  </div>

                  {log.review && (
                    <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                      {log.review}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-20 text-center">
                {logs.length === 0 ? (
                  <>
                    <p className="text-zinc-400">Your library is empty.</p>
                    <Link
                      href="/"
                      className="mt-3 inline-block text-sm text-violet-400 transition-colors hover:text-violet-300"
                    >
                      Discover games to log →
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="text-zinc-500">No games with status "{filter}"</p>
                    <button
                      onClick={() => setFilter('All')}
                      className="mt-3 text-sm text-violet-400 transition-colors hover:text-violet-300"
                    >
                      Show all games
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}

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

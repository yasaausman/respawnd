'use client'

import { useState } from 'react'
import type { Status } from '@/app/lib/data'

const API_BASE = 'http://localhost:8000'
const STATUSES: Status[] = ['Played', 'Playing', 'Backlog', 'Want']

interface Props {
  rawgId: number
  gameTitle: string
  coverUrl: string | null
}

export default function LogGameForm({ rawgId, gameTitle, coverUrl }: Props) {
  const [status, setStatus] = useState<Status>('Played')
  const [rating, setRating] = useState(7)
  const [review, setReview] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawg_id: rawgId,
          title: gameTitle,
          cover_url: coverUrl,
          status,
          rating,
          review: review.trim() || null,
        }),
      })
      if (!res.ok) throw new Error('Server error')
      setSubmitted(true)
    } catch {
      setError('Failed to save. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/30 p-8 text-center">
        <div className="mb-2 text-3xl">✓</div>
        <p className="text-lg font-semibold text-emerald-400">Logged!</p>
        <p className="mt-1 text-sm text-zinc-400">
          <span className="text-zinc-200">{gameTitle}</span> has been added to
          your library.
        </p>
        <button
          onClick={() => { setSubmitted(false); setReview(''); setRating(7); setStatus('Played') }}
          className="mt-5 text-sm text-zinc-500 underline-offset-2 hover:text-zinc-300 hover:underline transition-colors"
        >
          Log again
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
      <h2 className="text-lg font-semibold text-zinc-100">Log this game</h2>
      <p className="mt-1 text-sm text-zinc-500">
        Add <span className="text-zinc-300">{gameTitle}</span> to your library
      </p>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-6">
        {/* Status */}
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Status
          </label>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  status === s
                    ? 'bg-violet-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Rating */}
        <div>
          <label
            htmlFor="rating"
            className="mb-3 flex items-center justify-between text-sm font-medium text-zinc-300"
          >
            <span>Rating</span>
            <span className="text-lg font-bold text-violet-400">{rating}</span>
          </label>
          <input
            id="rating"
            type="range"
            min={1}
            max={10}
            step={1}
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="mt-1.5 flex justify-between text-xs text-zinc-600">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>

        {/* Review */}
        <div>
          <label
            htmlFor="review"
            className="mb-3 block text-sm font-medium text-zinc-300"
          >
            Review{' '}
            <span className="font-normal text-zinc-600">(optional)</span>
          </label>
          <textarea
            id="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="Share your thoughts..."
            rows={4}
            className="w-full resize-none rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none ring-violet-600 transition focus:ring-2"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-red-800/50 bg-red-950/30 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-500 active:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Add to Library'}
        </button>
      </form>
    </div>
  )
}

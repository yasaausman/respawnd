import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { GameDetail } from '@/app/lib/data'
import LogGameForm from '@/app/components/LogGameForm'

const API_BASE = 'http://localhost:8000'

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

async function getGame(id: string): Promise<GameDetail | null> {
  const gameId = parseInt(id, 10)
  if (isNaN(gameId)) return null
  const res = await fetch(`${API_BASE}/api/game/${gameId}`, {
    cache: 'no-store',
  })
  if (!res.ok) return null
  return res.json() as Promise<GameDetail>
}

export default async function GamePage(props: PageProps<'/games/[id]'>) {
  const { id } = await props.params
  const game = await getGame(id)

  if (!game) notFound()

  const releaseYear = game.released?.split('-')[0] ?? null
  const releaseFormatted = game.released
    ? new Date(game.released + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  const developer = game.developers?.[0]?.name ?? null
  const description = game.description ? stripHtml(game.description) : null

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300"
      >
        ← Back to Discover
      </Link>

      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        {/* Cover */}
        <div className="shrink-0 md:sticky md:top-24">
          <div className="relative mx-auto h-80 w-56 overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/60 md:h-96 md:w-64">
            {game.background_image ? (
              <Image
                src={game.background_image}
                alt={game.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-zinc-800 p-4 text-center text-sm text-zinc-600">
                {game.name}
              </div>
            )}
          </div>
        </div>

        {/* Info + form */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div>
            <p className="text-sm text-zinc-500">
              {[developer, releaseYear].filter(Boolean).join(' · ')}
            </p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-100 md:text-4xl">
              {game.name}
            </h1>

            {game.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {game.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="rounded-full border border-violet-800/50 bg-violet-900/40 px-3 py-1 text-xs font-medium text-violet-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
              {releaseFormatted && (
                <p className="text-zinc-400">
                  Released:{' '}
                  <span className="text-zinc-300">{releaseFormatted}</span>
                </p>
              )}
              {game.metacritic != null && game.metacritic > 0 && (
                <span
                  className={`rounded-md px-2 py-0.5 text-xs font-bold ${
                    game.metacritic >= 80
                      ? 'bg-emerald-900/50 text-emerald-300'
                      : game.metacritic >= 60
                        ? 'bg-amber-900/50 text-amber-300'
                        : 'bg-red-900/50 text-red-300'
                  }`}
                >
                  MC {game.metacritic}
                </span>
              )}
              {game.rating > 0 && (
                <span className="text-zinc-400">
                  ★ {game.rating.toFixed(1)}{' '}
                  <span className="text-zinc-600">/ 5</span>
                </span>
              )}
            </div>

            {description && (
              <p className="mt-4 max-w-prose leading-relaxed text-zinc-400">
                {description}
              </p>
            )}
          </div>

          <LogGameForm gameTitle={game.name} />
        </div>
      </div>
    </main>
  )
}

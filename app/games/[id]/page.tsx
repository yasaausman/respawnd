import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { GameDetail } from '@/app/lib/data'
import LogGameForm from '@/app/components/LogGameForm'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

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
  const res = await fetch(`${API_BASE}/api/game/${gameId}`, { cache: 'no-store' })
  if (!res.ok) return null
  return res.json() as Promise<GameDetail>
}

async function getScreenshots(id: string) {
  const res = await fetch(`${API_BASE}/api/game/${id}/screenshots`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.results ?? []
}

async function getSimilar(id: string) {
  const res = await fetch(`${API_BASE}/api/game/${id}/similar`, { cache: 'no-store' })
  if (!res.ok) return []
  const data = await res.json()
  return data.results ?? []
}

export default async function GamePage(props: PageProps<'/games/[id]'>) {
  const { id } = await props.params
  const [game, screenshots, similar] = await Promise.all([
    getGame(id),
    getScreenshots(id),
    getSimilar(id),
  ])

  if (!game) notFound()

  const releaseYear = game.released?.split('-')[0] ?? null
  const releaseFormatted = game.released
    ? new Date(game.released + 'T00:00:00').toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      })
    : null

  const developer = game.developers?.[0]?.name ?? null
  const description = game.description ? stripHtml(game.description) : null
  const platforms = game.platforms?.map((p: any) => p.platform.name) ?? []

  return (
    <main
      className="min-h-screen text-zinc-100 px-6 py-10"
      style={{ background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)' }}
    >
      <div className="mx-auto max-w-5xl">
        <Link href="/discover" className="mb-8 inline-flex items-center gap-1.5 text-sm text-zinc-500 transition-colors hover:text-zinc-300 cursor-none">
          ← Back to Discover
        </Link>

        <div className="flex flex-col gap-8 md:flex-row md:items-start mt-6">
          {/* Cover */}
          <div className="shrink-0 md:sticky md:top-24">
            <div className="relative mx-auto h-80 w-56 overflow-hidden rounded-2xl border border-zinc-800 shadow-2xl shadow-black/60 md:h-96 md:w-64">
              {game.background_image ? (
                <Image src={game.background_image} alt={game.name} fill className="object-cover" priority />
              ) : (
                <div className="flex h-full items-center justify-center bg-zinc-800 p-4 text-center text-sm text-zinc-600">{game.name}</div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-1 flex-col gap-6">
            <div>
              <p className="text-sm text-zinc-500">{[developer, releaseYear].filter(Boolean).join(' · ')}</p>
              <h1 className="mt-1 text-3xl font-bold text-zinc-100 md:text-4xl">{game.name}</h1>

              {/* Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-3">
                {game.metacritic != null && game.metacritic > 0 && (
                  <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${game.metacritic >= 80 ? 'bg-emerald-900/50 text-emerald-300' : game.metacritic >= 60 ? 'bg-amber-900/50 text-amber-300' : 'bg-red-900/50 text-red-300'}`}>
                    MC {game.metacritic}
                  </span>
                )}
                {game.rating > 0 && (
                  <span className="text-zinc-400 text-sm">★ {game.rating.toFixed(1)} <span className="text-zinc-600">/ 5</span></span>
                )}
                {releaseFormatted && (
                  <span className="text-zinc-400 text-sm">{releaseFormatted}</span>
                )}
              </div>

              {/* Genres */}
              {game.genres.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {game.genres.map((genre: any) => (
                    <span key={genre.id} className="rounded-full border border-violet-800/50 bg-violet-900/40 px-3 py-1 text-xs font-medium text-violet-300">
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {/* Platforms */}
              {platforms.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-zinc-500 mb-2">Available on</p>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((p: string) => (
                      <span key={p} className="rounded-md bg-zinc-800 px-2 py-1 text-xs text-zinc-300">{p}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <p className="mt-4 max-w-prose leading-relaxed text-zinc-400 text-sm">{description}</p>
              )}
            </div>

            <LogGameForm rawgId={game.id} gameTitle={game.name} coverUrl={game.background_image} />
          </div>
        </div>

        {/* Screenshots */}
        {screenshots.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-4">Screenshots</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {screenshots.map((s: any) => (
                <div key={s.id} className="relative h-40 overflow-hidden rounded-lg">
                  <Image src={s.image} alt="Screenshot" fill className="object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* More like this */}
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-xl font-bold mb-4">More Games Like This</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {similar.map((g: any) => (
                <Link key={g.id} href={`/games/${g.id}`} className="group flex-shrink-0 cursor-none">
                  <div className="relative h-48 w-36 overflow-hidden rounded-lg">
                    <Image src={g.background_image} alt={g.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <p className="mt-1 text-xs text-zinc-400 w-36 line-clamp-1 group-hover:text-zinc-100 transition-colors">{g.name}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
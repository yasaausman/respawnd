import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { GAMES } from '@/app/lib/data'
import LogGameForm from '@/app/components/LogGameForm'

export default async function GamePage(props: PageProps<'/games/[id]'>) {
  const { id } = await props.params
  const game = GAMES.find((g) => g.id === id)

  if (!game) notFound()

  const releaseYear = game.releaseDate.split('-')[0]
  const releaseFormatted = new Date(game.releaseDate + 'T00:00:00').toLocaleDateString(
    'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  )

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
            <Image
              src={game.coverUrl}
              alt={game.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Info + form */}
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div>
            <p className="text-sm text-zinc-500">{game.developer} · {releaseYear}</p>
            <h1 className="mt-1 text-3xl font-bold text-zinc-100 md:text-4xl">
              {game.title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              {game.genres.map((genre) => (
                <span
                  key={genre}
                  className="rounded-full border border-violet-800/50 bg-violet-900/40 px-3 py-1 text-xs font-medium text-violet-300"
                >
                  {genre}
                </span>
              ))}
            </div>

            <p className="mt-4 text-sm text-zinc-400">
              Released:{' '}
              <span className="text-zinc-300">{releaseFormatted}</span>
            </p>

            <p className="mt-4 max-w-prose leading-relaxed text-zinc-400">
              {game.description}
            </p>
          </div>

          <LogGameForm gameTitle={game.title} />
        </div>
      </div>
    </main>
  )
}

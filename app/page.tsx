import GameGrid from '@/app/components/GameGrid'

export default function Home() {
  return (
    <main className="mx-auto max-w-7xl px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-zinc-100">Discover Games</h1>
        <p className="mt-2 text-zinc-400">
          Search and explore your next adventure
        </p>
      </div>
      <GameGrid />
    </main>
  )
}

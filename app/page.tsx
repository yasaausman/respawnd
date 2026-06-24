'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'

const ControllerScene = dynamic(
  () => import('@/app/components/three/ControllerScene'),
  { ssr: false }
)

export default function Home() {
  return (
    <main
      className="relative min-h-screen text-zinc-100 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 70% 40%, #2d1b69 0%, #1a1a2e 40%, #16213e 100%)'
      }}
    >
      {/* Hero */}
      <section className="flex flex-col items-center justify-center gap-10 px-6 pt-16 pb-8 md:flex-row md:gap-0">        
        {/* Left — copy */}
        <div className="flex flex-col gap-6 md:w-1/2 md:pr-12 pl-12">
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight md:text-6xl">
            Your games.<br />
            <span className="text-violet-400">Your library.</span>
          </h1>
          <p className="max-w-md text-lg text-zinc-400">
            Log what you played. Rate what you finished. Track what's next.
          </p>
          <Link
            href="/library"
            className="w-fit rounded-full bg-violet-600 px-8 py-3 text-lg font-bold tracking-wide transition hover:bg-violet-500 active:scale-95"
          >
            Spawn In →
          </Link>
        </div>

        {/* Right — 3D controller */}
        <div className="h-[300px] w-full md:h-[500px] md:w-1/2 flex items-center justify-center">
          <ControllerScene />
        </div>

      </section>
      {/* Feature strip */}
      <section className="border-t border-violet-900/30 bg-[#0d0820]/60 px-6 py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3 pl-12">
          {[
            { icon: '🎮', title: 'Log Everything', desc: 'Track every game you play, drop, or finish.' },
            { icon: '⭐', title: 'Rate & Review', desc: 'Score your games and write your take.' },
            { icon: '📋', title: 'Build Your Backlog', desc: 'Never lose track of what to play next.' },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="text-4xl">{icon}</span>
              <h3 className="text-lg font-bold text-zinc-100">{title}</h3>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Footer */}
      <footer className="border-t border-violet-900/30 px-6 py-6 text-center text-xs text-zinc-600">
        <a href="https://poly.pizza/m/fCyA3Ug79X" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-400 transition">
          3D controller by Ginsta [CC-BY] via Poly Pizza
        </a>
      </footer>
    </main>
  )
}
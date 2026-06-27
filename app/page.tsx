'use client'
import dynamic from 'next/dynamic'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const ControllerScene = dynamic(
  () => import('@/app/components/three/ControllerScene'),
  { ssr: false }
)

const FEATURES = [
  { tag: 'TRACK', icon: '🎮', title: 'Log Everything', desc: 'Track every game you play, drop, or finish.' },
  { tag: 'RATE', icon: '⭐', title: 'Rate & Review', desc: 'Score your games and write your take.' },
  { tag: 'PLAN', icon: '📋', title: 'Build Your Backlog', desc: 'Never lose track of what to play next.' },
]

const PARTICLES = [
  { l: '8%', d: '0s', dur: '13s', s: 3 }, { l: '18%', d: '4s', dur: '16s', s: 2 },
  { l: '32%', d: '7s', dur: '12s', s: 4 }, { l: '47%', d: '2s', dur: '17s', s: 2 },
  { l: '58%', d: '9s', dur: '14s', s: 3 }, { l: '67%', d: '5s', dur: '11s', s: 2 },
  { l: '74%', d: '1s', dur: '18s', s: 4 }, { l: '83%', d: '6s', dur: '13s', s: 3 },
  { l: '91%', d: '3s', dur: '15s', s: 2 }, { l: '12%', d: '8s', dur: '12s', s: 2 },
  { l: '52%', d: '11s', dur: '16s', s: 3 }, { l: '78%', d: '10s', dur: '14s', s: 2 },
]

function FeatureCard({ tag, icon, title, desc, index }: { tag: string; icon: string; title: string; desc: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-700 hover:border-violet-500/40 hover:bg-white/[0.06] hover:shadow-[0_0_30px_-10px_rgba(124,58,237,0.6)]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${index * 0.15}s`,
      }}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="text-3xl">{icon}</span>
        <span className="text-[10px] tracking-[0.25em] text-cyan-400/60 font-[family-name:var(--font-space-mono)]">{tag}</span>
      </div>
      <h3 className="text-lg font-bold text-zinc-100 font-[family-name:var(--font-display)]">{title}</h3>
      <p className="mt-2 text-sm text-zinc-400">{desc}</p>
    </div>
  )
}

export default function Home() {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 80); return () => clearTimeout(t) }, [])

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0A0612] text-zinc-100">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
        @keyframes ringPulse { 0%,100% { transform: translate(-50%,-50%) scale(0.92); opacity: 0.7; } 50% { transform: translate(-50%,-50%) scale(1); opacity: 1; } }
        @keyframes ringSpin { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes drift {
          0% { transform: translateY(0); opacity: 0; }
          10% { opacity: 0.9; }
          90% { opacity: 0.9; }
          100% { transform: translateY(-220px); opacity: 0; }
        }
        .load-item { opacity: 0; transform: translateY(24px); transition: opacity 1.2s cubic-bezier(0.22,1,0.36,1), transform 1.2s cubic-bezier(0.22,1,0.36,1); }
        .load-item.in { opacity: 1; transform: translateY(0); }
        @media (prefers-reduced-motion: reduce) { .load-item, .anim { animation: none !important; transition: none !important; } }
      `}</style>

      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-20 -top-20 h-[650px] w-[650px] rounded-full bg-violet-600/35 blur-[110px]" />
        <div className="absolute -bottom-40 -left-20 h-[560px] w-[560px] rounded-full bg-cyan-500/20 blur-[120px]" />
        <div className="absolute right-1/4 top-1/2 h-[600px] w-[600px] rounded-full bg-fuchsia-600/15 blur-[130px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#0A0612_95%)]" />
      </div>

      {/* Perspective grid floor */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[40vh] [perspective:550px]">
        <div
          className="absolute inset-0 [transform:rotateX(74deg)] [transform-origin:center_bottom]"
          style={{
            backgroundImage: 'linear-gradient(rgba(139,92,246,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.35) 1px, transparent 1px)',
            backgroundSize: '70px 70px',
            maskImage: 'linear-gradient(to top, black, transparent 75%)',
            WebkitMaskImage: 'linear-gradient(to top, black, transparent 75%)',
          }}
        />
      </div>

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="anim absolute bottom-0 rounded-full bg-violet-300"
            style={{ left: p.l, width: p.s, height: p.s, animation: `drift ${p.dur} linear ${p.d} infinite` }}
          />
        ))}
      </div>

      {/* Hero */}
      <section className="relative mx-auto flex min-h-[calc(100vh-73px)] max-w-7xl flex-col items-center gap-10 px-6 pt-16 pb-12 md:flex-row md:gap-4 md:pt-8">
        {/* Left copy */}
        <div className="flex flex-col gap-6 md:w-[45%]">
          <span className={`load-item${loaded ? ' in' : ''} text-xs tracking-[0.3em] text-cyan-400/80 font-[family-name:var(--font-space-mono)]`} style={{ transitionDelay: '0.1s' }}>
            ◍ RESPAWND // GAME TRACKER
          </span>
          <h1 className={`load-item${loaded ? ' in' : ''} text-6xl font-bold leading-[1.02] tracking-tight md:text-7xl font-[family-name:var(--font-display)]`} style={{ transitionDelay: '0.25s' }}>
            Your games.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
              Your library.
            </span>
          </h1>
          <p className={`load-item${loaded ? ' in' : ''} max-w-md text-lg text-zinc-400`} style={{ transitionDelay: '0.4s' }}>
            Log what you played. Rate what you finished. Track what's next.
          </p>
          <div className={`load-item${loaded ? ' in' : ''} flex flex-wrap items-center gap-4`} style={{ transitionDelay: '0.55s' }}>
            <Link
              href="/login"
              className="w-fit rounded-full bg-gradient-to-b from-violet-500 to-violet-700 px-8 py-3 text-lg font-bold tracking-wide text-white shadow-[0_6px_30px_-4px_rgba(124,58,237,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:from-violet-400 hover:to-violet-600 hover:shadow-[0_8px_40px_0px_rgba(124,58,237,1)] active:scale-95"
            >
              Spawn In →
            </Link>
            <Link
              href="/discover"
              className="w-fit rounded-full border border-white/10 px-6 py-3 text-sm font-medium text-zinc-300 backdrop-blur-sm transition hover:border-white/30 hover:text-white"
            >
              Browse as guest →
            </Link>
          </div>
        </div>

        {/* Right controller */}
        <div className={`load-item${loaded ? ' in' : ''} relative flex h-[420px] w-full items-center justify-center md:h-[600px] md:w-[55%]`} style={{ transitionDelay: '0.2s' }}>
          <div className="pointer-events-none absolute left-1/2 top-[32%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/40 blur-[70px] md:h-96 md:w-96" />
          <div className="pointer-events-none absolute left-1/2 top-[32%] h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fuchsia-300/30 blur-[50px]" />
          <div className="anim absolute left-1/2 top-[32%] h-80 w-80 rounded-full border-2 border-violet-400/50 md:h-[420px] md:w-[420px]"
               style={{ animation: 'ringPulse 4s ease-in-out infinite', boxShadow: '0 0 50px rgba(139,92,246,0.4), inset 0 0 50px rgba(139,92,246,0.2)' }} />
          <div className="anim absolute left-1/2 top-[32%] h-64 w-64 rounded-full border border-cyan-400/40 md:h-80 md:w-80"
               style={{ animation: 'ringSpin 18s linear infinite' }} />
          <div className="anim absolute left-1/2 top-[32%] h-[360px] w-[360px] rounded-full border border-fuchsia-400/20 md:h-[480px] md:w-[480px]"
               style={{ animation: 'ringSpin 30s linear infinite reverse' }} />
          <div className="pointer-events-none absolute left-1/2 top-[32%] h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 md:h-[520px] md:w-[520px]">
            <span className="absolute left-0 top-0 h-8 w-8 border-l-2 border-t-2 border-cyan-400/50" />
            <span className="absolute right-0 top-0 h-8 w-8 border-r-2 border-t-2 border-cyan-400/50" />
            <span className="absolute bottom-0 left-0 h-8 w-8 border-b-2 border-l-2 border-cyan-400/50" />
            <span className="absolute bottom-0 right-0 h-8 w-8 border-b-2 border-r-2 border-cyan-400/50" />
          </div>
          <div className="anim relative z-10 h-full w-full" style={{ animation: 'float 6s ease-in-out infinite' }}>
            <ControllerScene />
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="relative px-6 pb-24 pt-8">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 px-6 py-6 text-center text-xs text-zinc-600">
        <a href="https://poly.pizza/m/fCyA3Ug79X" target="_blank" rel="noopener noreferrer" className="transition hover:text-zinc-400">
          3D controller by Ginsta [CC-BY] via Poly Pizza
        </a>
      </footer>
    </main>
  )
}

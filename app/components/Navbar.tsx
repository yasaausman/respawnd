'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase/client'

const LINKS = [
  { href: '/discover', label: 'Discover' },
  { href: '/library', label: 'My Library' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* glass background */}
      <div className="absolute inset-0 -z-10 border-b border-white/10 bg-[#0b0718]/70 backdrop-blur-xl" />
      {/* gradient underline */}
      <div className="absolute inset-x-0 bottom-0 -z-10 h-px bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="cursor-none">
          <span className="bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-xl font-bold tracking-tight text-transparent [text-shadow:0_0_20px_rgba(139,92,246,0.5)]">
            respawnd
          </span>
        </Link>

        <nav className="flex items-center gap-2">
          {LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`cursor-none rounded-full px-4 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-100'
                }`}
              >
                {label}
              </Link>
            )
          })}

          {user ? (
            <div className="ml-2 flex items-center gap-3">
              <span className="text-sm text-zinc-300">
                {user.user_metadata?.full_name?.split(' ')[0] ?? 'Player'}
              </span>
              <button
                onClick={signOut}
                className="cursor-none rounded-full border border-white/10 px-4 py-1.5 text-sm text-zinc-300 transition hover:border-white/25 hover:text-white"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 cursor-none rounded-full bg-gradient-to-b from-violet-500 to-violet-700 px-5 py-2 text-sm font-semibold text-white shadow-[0_4px_20px_-4px_rgba(124,58,237,0.8),inset_0_1px_0_rgba(255,255,255,0.25)] transition hover:from-violet-400 hover:to-violet-600 hover:shadow-[0_6px_28px_-2px_rgba(124,58,237,1),inset_0_1px_0_rgba(255,255,255,0.3)] active:scale-95"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}

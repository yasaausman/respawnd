import type { Metadata } from 'next'
import { Geist, Geist_Mono, Space_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/app/components/Navbar'
import CustomCursor from '@/app/components/CustomCursor'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'respawnd',
  description: 'Track and discover your games',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body>
        <CustomCursor />
        <Navbar />
        {children}
      </body>
    </html>
  )
}

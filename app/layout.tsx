import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PatternWatch — Open Anomaly Research',
  description: 'Crowdsourced anomaly reporting for pre-event pattern discovery',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-100 min-h-screen`}>
        {/* Header */}
        <header className="border-b border-zinc-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                <span className="text-white text-lg">◉</span>
              </div>
              <div>
                <div className="font-semibold">PatternWatch</div>
                <div className="text-xs text-zinc-500">Open anomaly research</div>
              </div>
            </Link>
            
            <nav className="flex gap-1">
              <Link href="/" className="px-3 py-1.5 text-sm rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100">
                Map
              </Link>
              <Link href="/report" className="px-3 py-1.5 text-sm rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100">
                Report
              </Link>
              <Link href="/about" className="px-3 py-1.5 text-sm rounded-md hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100">
                About
              </Link>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between text-sm text-zinc-500">
            <div>Open source · No profit · Public data</div>
            <div className="flex gap-4">
              <a href="https://github.com" className="hover:text-zinc-300">GitHub</a>
              <Link href="/about" className="hover:text-zinc-300">About</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
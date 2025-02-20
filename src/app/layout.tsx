import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { BookOpen, Library, User } from 'lucide-react'
import { getServerSession } from 'next-auth'
import { authConfig } from '@/lib/prisma-adapter'
import SessionProvider from './components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Grantha - Digital Library',
  description: 'Your personal digital book reading platform',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authConfig)

  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <SessionProvider session={session}>
          <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-primary">
                Grantha
              </Link>
              <div className="flex space-x-6">
                <Link href="/library" className="flex items-center space-x-2 hover:text-primary">
                  <Library size={20} />
                  <span>Library</span>
                </Link>
                <Link href="/reader" className="flex items-center space-x-2 hover:text-primary">
                  <BookOpen size={20} />
                  <span>Reader</span>
                </Link>
                <Link href="/profile" className="flex items-center space-x-2 hover:text-primary">
                  <User size={20} />
                  <span>Profile</span>
                </Link>
              </div>
            </div>
          </nav>
          {children}
          <footer className="bg-white py-6 mt-12">
            <div className="container mx-auto px-4 text-center">
              <p>&copy; 2025 Grantha. All rights reserved.</p>
            </div>
          </footer>
        </SessionProvider>
      </body>
    </html>
  )
}

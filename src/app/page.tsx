import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Library, User } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 text-primary">Grantha</h1>
          <p className="text-xl mb-12">Your Digital Library Companion</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <BookOpen className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-semibold mb-4">Read Anywhere</h2>
              <p>Access your books across all devices with our responsive reader.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <Library className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-semibold mb-4">Organize Library</h2>
              <p>Curate your personal library with easy filtering and tagging.</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <User className="mx-auto mb-4 text-primary" size={48} />
              <h2 className="text-2xl font-semibold mb-4">Personal Experience</h2>
              <p>Track reading progress, make notes, and customize your reading.</p>
            </div>
          </div>
          
          <div className="mt-12">
            <Link 
              href="/library" 
              className="bg-primary text-primary-foreground px-8 py-3 rounded-full text-lg hover:bg-primary/90 transition-colors"
            >
              Explore Library
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

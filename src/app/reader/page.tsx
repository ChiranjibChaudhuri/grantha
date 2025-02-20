import { BookOpen } from 'lucide-react'

export default function ReaderPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 flex items-center">
        <BookOpen className="mr-4 text-primary" size={40} />
        Book Reader
      </h1>
      <div className="grid gap-4">
        <p className="text-lg">No book is currently open. Select a book from your library to start reading.</p>
      </div>
    </main>
  )
}

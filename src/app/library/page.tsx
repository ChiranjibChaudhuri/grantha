'use client'

import { PrismaClient } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Tag, User } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Book {
  id: string
  title: string
  author: string
  description: string
  coverImageUrl: string | null
  genres: string[]
  tags: string[]
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await fetch('/api/books')
        const data = await response.json()
        setBooks(data)
      } catch (error) {
        console.error('Failed to fetch books:', error)
      }
    }
    fetchBooks()
  }, [])

  const genres = [...new Set(books.flatMap(book => 
    JSON.parse(book.genres as unknown as string)
  ))]

  const filteredBooks = selectedGenre 
    ? books.filter(book => 
        JSON.parse(book.genres as unknown as string).includes(selectedGenre)
      )
    : books

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-8">
        <BookOpen className="mr-4 text-primary" size={40} />
        <h1 className="text-4xl font-bold">My Library</h1>
      </div>

      {/* Genre Filter */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Genres</h2>
        <div className="flex flex-wrap gap-4">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setSelectedGenre(genre === selectedGenre ? null : genre)}
              className={`
                px-4 py-2 rounded-full flex items-center gap-2 
                ${selectedGenre === genre 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}
              `}
            >
              <Tag size={16} />
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBooks.map(book => (
          <div 
            key={book.id} 
            className="bg-white shadow-lg rounded-xl overflow-hidden 
                        transition-all duration-300 hover:shadow-xl 
                        hover:-translate-y-2 group"
          >
            {book.coverImageUrl && (
              <div className="relative h-64 w-full">
                <Image 
                  src={book.coverImageUrl} 
                  alt={book.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-primary">
                {book.title}
              </h2>
              <div className="flex items-center text-gray-600 mb-4">
                <User size={16} className="mr-2" />
                <span>{book.author}</span>
              </div>
              <p className="text-gray-700 mb-4 line-clamp-3">
                {book.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {JSON.parse(book.genres as unknown as string).map((genre: string) => (
                  <span 
                    key={genre} 
                    className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-xs"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <Link 
                  href={`/reader/${book.id}`}
                  className="bg-primary text-white px-4 py-2 rounded-full 
                             hover:bg-primary-dark transition-colors"
                >
                  Start Reading
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No books found in this genre.
        </div>
      )}
    </main>
  )
}

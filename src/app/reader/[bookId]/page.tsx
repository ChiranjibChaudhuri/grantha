'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { Book, Chapter } from '@prisma/client'
import { ChevronLeft, ChevronRight, Moon, Sun, ZoomIn, ZoomOut } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import MarkdownReader from "@/components/MarkdownReader";

// Configuration for reading experience
const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24] as const
type FontSize = typeof FONT_SIZES[number]

export default function ReaderPage({ params }: { params: { bookId: string } }) {
  // State management
  const [book, setBook] = useState<Book | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [fontSize, setFontSize] = useState<FontSize>(16)
  
  // Fetch book and chapter details
  const fetchBookDetails = useCallback(async () => {
    try {
      // Fetch book metadata
      const bookResponse = await fetch(`/api/books/${params.bookId}`)
      const bookData = await bookResponse.json()
      setBook(bookData)

      // Fetch book chapters
      const chaptersResponse = await fetch(`/api/books/${params.bookId}/chapters`)
      const chaptersData = await chaptersResponse.json()
      setChapters(chaptersData)

      // Set first chapter as default
      if (chaptersData.length > 0) {
        // Fetch first chapter's full content
        const firstChapterResponse = await fetch(`/api/chapters/${chaptersData[0].id}`)
        const firstChapterData = await firstChapterResponse.json()
        setCurrentChapter(firstChapterData)
      }
    } catch (error) {
      console.error('Failed to fetch book details:', error)
    }
  }, [params.bookId])

  useEffect(() => {
    fetchBookDetails()
  }, [fetchBookDetails])

  // Theme and font size handlers
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')
  
  const adjustFontSize = (direction: 'increase' | 'decrease') => {
    const currentIndex = FONT_SIZES.indexOf(fontSize)
    if (direction === 'increase' && currentIndex < FONT_SIZES.length - 1) {
      setFontSize(FONT_SIZES[currentIndex + 1])
    } else if (direction === 'decrease' && currentIndex > 0) {
      setFontSize(FONT_SIZES[currentIndex - 1])
    }
  }

  // Chapter navigation
  const goToPreviousChapter = async () => {
    if (!currentChapter || !chapters.length) return

    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id)
    if (currentIndex > 0) {
      const prevChapterResponse = await fetch(`/api/chapters/${chapters[currentIndex - 1].id}`)
      const prevChapterData = await prevChapterResponse.json()
      setCurrentChapter(prevChapterData)
    }
  }

  const goToNextChapter = async () => {
    if (!currentChapter || !chapters.length) return

    const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id)
    if (currentIndex < chapters.length - 1) {
      const nextChapterResponse = await fetch(`/api/chapters/${chapters[currentIndex + 1].id}`)
      const nextChapterData = await nextChapterResponse.json()
      setCurrentChapter(nextChapterData)
    }
  }

  if (!book || !currentChapter) return <div className="text-center py-10">Loading...</div>

  return (
    <MarkdownReader 
      filePath={`/book_md/alice_s_adventures_in_wonderland.md`} 
      bookId={params.bookId} 
    />
  )
}

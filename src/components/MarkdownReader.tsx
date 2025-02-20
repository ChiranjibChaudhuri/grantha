'use client'

import React, { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { useSwipeable } from "react-swipeable";
import { ChevronLeft, ChevronRight, Moon, Sun, ZoomIn, ZoomOut } from 'lucide-react';

// Configuration for reading experience
const FONT_SIZES = [12, 14, 16, 18, 20, 22, 24] as const
type FontSize = typeof FONT_SIZES[number]

interface MarkdownReaderProps {
  filePath: string;
  bookId?: string;
}

const MarkdownReader: React.FC<MarkdownReaderProps> = ({ filePath, bookId }) => {
  const [content, setContent] = useState<string>("");
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [fontSize, setFontSize] = useState<FontSize>(16)
  const [chapters, setChapters] = useState<{id: string, title: string, chapterNumber: string}[]>([])
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)

  // Load markdown content and chapters
  useEffect(() => {
    // Fetch markdown content
    fetch(filePath)
      .then((res) => res.text())
      .then((text) => setContent(text));

    // Fetch chapters if bookId is provided
    if (bookId) {
      fetch(`/api/books/${bookId}/chapters`)
        .then(res => res.json())
        .then(setChapters)
    }
  }, [filePath, bookId]);

  // Fetch current chapter's full content
  const fetchChapterContent = useCallback(async (chapterId: string) => {
    const response = await fetch(`/api/chapters/${chapterId}`)
    const chapterData = await response.json()
    return chapterData.content
  }, [])

  // Swipe Gesture for Navigation
  const handlers = useSwipeable({
    onSwipedLeft: () => goToNextChapter(),
    onSwipedRight: () => goToPreviousChapter(),
  });

  // Chapter Navigation
  const goToPreviousChapter = async () => {
    if (currentChapterIndex > 0) {
      const prevIndex = currentChapterIndex - 1
      const prevChapterId = chapters[prevIndex].id
      const prevChapterContent = await fetchChapterContent(prevChapterId)
      setContent(prevChapterContent)
      setCurrentChapterIndex(prevIndex)
    }
  }

  const goToNextChapter = async () => {
    if (currentChapterIndex < chapters.length - 1) {
      const nextIndex = currentChapterIndex + 1
      const nextChapterId = chapters[nextIndex].id
      const nextChapterContent = await fetchChapterContent(nextChapterId)
      setContent(nextChapterContent)
      setCurrentChapterIndex(nextIndex)
    }
  }

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

  return (
    <div 
      {...handlers}
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-[#f5f5dc] text-black'
      }`}
    >
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        {/* Reader Controls */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <div>
            {chapters.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Chapter {chapters[currentChapterIndex].chapterNumber}: {chapters[currentChapterIndex].title}
              </p>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => adjustFontSize('decrease')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Decrease font size"
            >
              <ZoomOut className="text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              onClick={() => adjustFontSize('increase')}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Increase font size"
            >
              <ZoomIn className="text-gray-600 dark:text-gray-300" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="text-gray-600" />
              ) : (
                <Sun className="text-yellow-500" />
              )}
            </button>
          </div>
        </div>

        {/* Markdown Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none" 
          style={{ 
            fontSize: `${fontSize}px`, 
            lineHeight: 1.6,
            fontFamily: "'Bookerly', 'Georgia', serif"
          }}
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeHighlight]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3" {...props} />,
              p: ({node, ...props}) => <p className="mb-4" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center border-t pt-4 mt-6">
          <button 
            onClick={goToPreviousChapter} 
            disabled={currentChapterIndex === 0}
            className="flex items-center space-x-2 px-4 py-2 rounded 
              disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <ChevronLeft /> 
            <span>Previous Chapter</span>
          </button>
          <span className="text-gray-600 dark:text-gray-300">
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </span>
          <button 
            onClick={goToNextChapter} 
            disabled={currentChapterIndex === chapters.length - 1}
            className="flex items-center space-x-2 px-4 py-2 rounded 
              disabled:opacity-50 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            <span>Next Chapter</span>
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarkdownReader;

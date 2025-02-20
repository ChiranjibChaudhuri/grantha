import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Utility functions for text processing
function cleanText(text) {
  return text.replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function extractMetadata(text) {
  const lines = text.split('\n')
  
  // Extract title (usually on a specific line)
  const titleLine = lines.find(line => 
    line.includes('Adventures') || 
    line.includes('Expectations') || 
    line.includes('Prejudice')
  )

  // Extract author (usually follows the title)
  const authorLine = lines.find((line, index) => 
    titleLine && lines.indexOf(line) > lines.indexOf(titleLine) && 
    line.trim().length > 0 && 
    !line.includes('PROJECT GUTENBERG') &&
    !line.includes('EDITION')
  )

  // Extract chapters
  const chapterPattern = /^CHAPTER\s+([IVXLCDM]+|\d+)\.\s*(.+)$/
  const chapters = lines.reduce((acc, line, index) => {
    const match = line.match(chapterPattern)
    if (match) {
      acc.push({
        number: match[1],
        title: match[2],
        startIndex: index
      })
    }
    return acc
  }, [])

  return {
    title: titleLine ? titleLine.trim() : 'Unknown Title',
    author: authorLine ? authorLine.trim() : 'Unknown Author',
    chapters: chapters
  }
}

function parseBookContent(filePath) {
  try {
    // Read the entire text file
    const rawText = fs.readFileSync(filePath, 'utf-8')
    const cleanedText = cleanText(rawText)
    
    // Extract metadata
    const metadata = extractMetadata(cleanedText)
    
    // Prepare chapter content
    const lines = cleanedText.split('\n')
    const chapterContents = metadata.chapters.map((chapter, index) => {
      const nextChapterIndex = metadata.chapters[index + 1]?.startIndex || lines.length
      const chapterText = lines.slice(chapter.startIndex, nextChapterIndex).join('\n')
      
      return {
        ...chapter,
        content: chapterText
      }
    })

    return {
      ...metadata,
      chapterContents
    }
  } catch (error) {
    console.error(`Error processing book ${filePath}:`, error)
    return null
  }
}

async function preprocessBooks() {
  const booksMdDir = path.join(process.cwd(), 'public', 'book_md')
  const mdFiles = fs.readdirSync(booksMdDir)
    .filter(file => file.endsWith('.md'))

  for (const fileName of mdFiles) {
    try {
      const filePath = path.join(booksMdDir, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf-8')
      const { data, content } = matter(fileContents)

      // Prepare book metadata from frontmatter
      const bookData = {
        title: data.title || path.basename(fileName, '.md'),
        author: data.author || 'Unknown Author',
        description: data.description || '',
        coverImageUrl: data.cover ? `/book_md/${data.cover}` : null,
        genres: data.genres ? JSON.stringify(data.genres) : '[]',
        tags: data.tags ? JSON.stringify(data.tags) : '[]'
      }

      // Find or create book in database
      let book = await prisma.book.findFirst({
        where: { 
          title: bookData.title,
          author: bookData.author
        }
      })

      if (!book) {
        book = await prisma.book.create({
          data: bookData
        })
      }

      // Parse chapters from markdown content
      const chapterPattern = /^(#+)\s*(.+)$/gm
      const chapters = []
      let match
      let lastChapterIndex = 0

      while ((match = chapterPattern.exec(content)) !== null) {
        // Determine chapter level (number of #)
        const chapterLevel = match[1].length
        const chapterTitle = match[2].trim()

        // Only process top-level chapters (single #)
        if (chapterLevel === 1) {
          const chapterStartIndex = match.index
          
          // Find the next chapter or end of content
          const nextChapterMatch = chapterPattern.exec(content)
          const chapterEndIndex = nextChapterMatch ? nextChapterMatch.index : content.length

          const chapterContent = content
            .slice(chapterStartIndex, nextChapterMatch ? nextChapterMatch.index : undefined)
            .trim()

          chapters.push({
            chapterNumber: (chapters.length + 1).toString(),
            title: chapterTitle,
            content: chapterContent
          })
        }
      }

      // Create or update chapters
      for (const chapter of chapters) {
        await prisma.chapter.upsert({
          where: { 
            bookId_chapterNumber: {
              bookId: book.id,
              chapterNumber: chapter.chapterNumber
            }
          },
          update: {
            title: chapter.title,
            content: chapter.content
          },
          create: {
            bookId: book.id,
            chapterNumber: chapter.chapterNumber,
            title: chapter.title,
            content: chapter.content
          }
        })
      }

      console.log(`Processed book: ${bookData.title}`)
    } catch (error) {
      console.error(`Error processing ${fileName}:`, error)
    }
  }
}

// Run the preprocessing
preprocessBooks()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

export {}

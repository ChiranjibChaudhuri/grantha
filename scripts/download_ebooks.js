import fs from 'fs'
import path from 'path'
import { PrismaClient } from '@prisma/client'
import axios from 'axios'

const prisma = new PrismaClient()

const BOOKS = [
  {
    id: 1342,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: ['Classic Literature', 'Romance'],
    tags: ['19th Century', 'British Literature']
  },
  {
    id: 11,
    title: 'Alice\'s Adventures in Wonderland',
    author: 'Lewis Carroll',
    genre: ['Children\'s Literature', 'Fantasy'],
    tags: ['Victorian Era', 'Nonsense Literature']
  },
  {
    id: 1661,
    title: 'The Adventures of Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    genre: ['Mystery', 'Detective Fiction'],
    tags: ['Victorian Era', 'Crime']
  },
  {
    id: 84,
    title: 'Frankenstein',
    author: 'Mary Shelley',
    genre: ['Gothic Fiction', 'Science Fiction'],
    tags: ['Romantic Period', 'Philosophical Novel']
  },
  {
    id: 1400,
    title: 'Great Expectations',
    author: 'Charles Dickens',
    genre: ['Classic Literature', 'Coming-of-Age'],
    tags: ['Victorian Era', 'Social Commentary']
  }
]

async function downloadFile(url, filePath) {
  try {
    console.log(`Downloading from ${url} to ${filePath}`)
    const response = await axios({
      method: 'get',
      url: url,
      responseType: 'stream'
    })

    const writer = fs.createWriteStream(filePath)
    response.data.pipe(writer)

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`Successfully downloaded: ${filePath}`)
        resolve(true)
      })
      writer.on('error', (err) => {
        console.error(`Error writing file ${filePath}:`, err)
        reject(err)
      })
    })
  } catch (error) {
    console.error(`Download error for ${url}:`, error.message)
    return false
  }
}

async function downloadEbook(book) {
  const booksDir = path.join(process.cwd(), 'public', 'books')
  
  // Ensure books directory exists
  if (!fs.existsSync(booksDir)) {
    fs.mkdirSync(booksDir, { recursive: true })
  }

  const sanitizeFileName = (title) => 
    title.toLowerCase().replace(/[^a-z0-9]/g, '_')

  const textFileName = `${sanitizeFileName(book.title)}.txt`
  const coverFileName = `${sanitizeFileName(book.title)}_cover.jpg`
  
  const textFilePath = path.join(booksDir, textFileName)
  const coverFilePath = path.join(booksDir, coverFileName)

  try {
    // Download text file
    const textDownloaded = await downloadFile(
      `https://www.gutenberg.org/files/${book.id}/${book.id}-0.txt`, 
      textFilePath
    )

    // Download cover image (using placeholder)
    const coverDownloaded = await downloadFile(
      `https://picsum.photos/seed/${encodeURIComponent(book.title)}/800/1200`, 
      coverFilePath
    )

    if (!textDownloaded || !coverDownloaded) {
      console.error(`Failed to download all files for ${book.title}`)
      return null
    }

    // Verify file sizes
    const textStats = fs.statSync(textFilePath)
    const coverStats = fs.statSync(coverFilePath)
    
    console.log(`${book.title} text file size: ${textStats.size} bytes`)
    console.log(`${book.title} cover file size: ${coverStats.size} bytes`)

    // Create database entry
    const bookEntry = await prisma.book.create({
      data: {
        title: book.title,
        author: book.author,
        description: `A classic work by ${book.author}`,
        coverImageUrl: `/books/${coverFileName}`,
        genres: JSON.stringify(book.genre),
        tags: JSON.stringify(book.tags)
      }
    })

    console.log(`Successfully imported: ${book.title}`)
    return bookEntry
  } catch (error) {
    console.error(`Comprehensive error for ${book.title}:`, error)
    return null
  }
}

async function main() {
  console.log('Starting ebook download process...')
  
  for (const book of BOOKS) {
    console.log(`Processing book: ${book.title}`)
    await downloadEbook(book)
  }
  
  console.log('Ebook download process completed.')
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })

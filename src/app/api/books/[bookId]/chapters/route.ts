import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest, 
  context: { params: { bookId: string } }
) {
  try {
    // Await params to resolve dynamic route
    const params = await context.params

    // Validate bookId is present and not empty
    if (!params.bookId) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 })
    }

    // Verify book exists
    const book = await prisma.book.findUnique({
      where: { id: params.bookId }
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    // Fetch chapters for the specific book
    const chapters = await prisma.chapter.findMany({
      where: { bookId: params.bookId },
      select: {
        id: true,
        chapterNumber: true,
        title: true
      },
      orderBy: {
        chapterNumber: 'asc'
      }
    })

    // Handle case where no chapters are found
    if (chapters.length === 0) {
      return NextResponse.json({ error: 'No chapters found for this book' }, { status: 404 })
    }

    // Return chapters
    return NextResponse.json(chapters)
  } catch (error) {
    console.error('Error fetching book chapters:', error)
    // Handle different types of errors
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) }, 
      { status: 500 }
    )
  } finally {
    // Ensure Prisma client is disconnected
    await prisma.$disconnect()
  }
}

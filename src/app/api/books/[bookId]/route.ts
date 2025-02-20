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

    // Find unique book by ID
    const book = await prisma.book.findUnique({
      where: { id: params.bookId }
    })

    // Handle case where book is not found
    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

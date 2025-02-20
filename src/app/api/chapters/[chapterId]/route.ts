import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  _request: Request, 
  context: { params: { chapterId: string } }
) {
  try {
    const { chapterId } = context.params

    // Validate chapterId is present and not empty
    if (!chapterId) {
      return NextResponse.json({ error: 'Chapter ID is required' }, { status: 400 })
    }

    // Fetch chapter details with full content
    const chapter = await prisma.chapter.findUnique({
      where: { id: chapterId },
      include: {
        book: {
          select: {
            title: true,
            author: true
          }
        }
      }
    })

    // Handle case where chapter is not found
    if (!chapter) {
      return NextResponse.json({ error: 'Chapter not found' }, { status: 404 })
    }

    // Return chapter details
    return NextResponse.json(chapter)
  } catch (error) {
    console.error('Error fetching chapter:', error)
    
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

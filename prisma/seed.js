import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a book
  const book = await prisma.book.create({
    data: {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      description: 'A classic novel of manners exploring love, marriage, and social status in early 19th-century England.',
      coverImageUrl: '/books/pride_and_prejudice_cover.jpg',
      genres: JSON.stringify(['Classic Literature', 'Romance', 'Fiction']),
      tags: JSON.stringify(['19th Century', 'British Literature', 'Social Commentary'])
    }
  })

  console.log('Book created:', book)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

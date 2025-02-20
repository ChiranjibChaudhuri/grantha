# Grantha: Digital Book Reader Platform 📚

## Overview
Grantha is a modern, feature-rich digital book reader application built with Next.js, designed to provide an immersive and customizable reading experience.

![Grantha Banner](./grantha_web/public/grantha_banner.png)

## 🌟 Features

### 📖 Book Management
- Markdown-based book import
- Automatic metadata extraction
- Dynamic chapter parsing
- Genre and tag filtering

### 🎨 Reader Experience
- Kindle-inspired UI
- Dark/Light mode
- Adjustable font sizes
- Swipe navigation
- Syntax highlighting for code blocks

### 🔒 Authentication
- OAuth integration (Google, GitHub)
- Secure user management

## 🚀 Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- Tailwind CSS
- React Markdown
- React Swipeable

### Backend
- Prisma ORM
- SQLite
- NextAuth.js

### Development Tools
- ESLint
- Prettier
- PostCSS

## 🛠 Prerequisites

- Node.js (v18+)
- npm or yarn
- Git

## 🔧 Local Setup

1. Clone the repository
```powershell
git clone https://github.com/yourusername/grantha.git
cd grantha
```

2. Install dependencies
```powershell
cd grantha_web
npm install
```

3. Set up environment variables
Create a `.env` file in the `grantha_web` directory with:
```
DATABASE_URL="file:./dev.db"
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

4. Initialize database
```powershell
npx prisma migrate dev
npx prisma generate
```

5. Preprocess books
```powershell
node scripts/preprocess_books.js
```

6. Run development server
```powershell
npm run dev
```

## 📂 Project Structure
```
grantha/
├── grantha_web/
│   ├── prisma/           # Database schema
│   ├── public/
│   │   └── book_md/      # Markdown book files
│   ├── scripts/          # Utility scripts
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # React components
│   │   └── lib/          # Utility functions
│   └── tailwind.config.ts
└── README.md
```

## 📚 Book Import Guide

1. Place markdown books in `public/book_md/`
2. Use frontmatter for metadata:
```markdown
---
title: My Book
author: John Doe
description: A great book
cover: book_cover.jpg
genres: 
  - Fiction
  - Science
tags:
  - Adventure
---

# Chapter 1
Book content here...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request

## 🐛 Known Issues
- Initial book import requires manual preprocessing
- Limited OAuth provider support

## 📄 License
MIT License

## 🌐 Contact
Chiranjib Chaudhuri - [Your Email]

**Happy Reading! 📖✨**

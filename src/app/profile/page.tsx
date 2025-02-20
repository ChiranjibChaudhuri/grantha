'use client'

import { signOut, useSession } from 'next-auth/react'
import { User, LogOut } from 'lucide-react'
import Image from 'next/image'
import { redirect } from 'next/navigation'

export default function ProfilePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/auth/signin')
    }
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8">
        <div className="flex flex-col items-center">
          {session?.user?.image && (
            <Image 
              src={session.user.image} 
              alt="Profile Picture" 
              width={100} 
              height={100} 
              className="rounded-full mb-4"
            />
          )}
          <h1 className="text-3xl font-bold mb-2 text-primary">
            {session?.user?.name || 'User Profile'}
          </h1>
          <p className="text-gray-600 mb-6">{session?.user?.email}</p>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
          >
            <LogOut className="mr-2" size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </main>
  )
}

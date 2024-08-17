import Link from 'next/link'
import React from 'react'

function Page() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Unlock Your Linux Journey</h1>
        <div className="space-y-6">
          <Link href="/dashboard/beginner" className="block bg-blue-500 text-white text-center py-4 px-8 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300">
              <span className="text-xl font-semibold">Beginner</span>
              <p className="text-sm mt-2">Start your journey with the basics.</p>
          </Link>
          <Link href="/dashboard/intermediate" className="block bg-green-500 text-white text-center py-4 px-8 rounded-lg shadow-lg hover:bg-green-600 transition duration-300">
              <span className="text-xl font-semibold">Intermediate</span>
              <p className="text-sm mt-2">Take your skills to the next level.</p>
          </Link>
          <Link href="/dashboard/advanced" className="block bg-yellow-500 text-white text-center py-4 px-8 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-300">
              <span className="text-xl font-semibold">Advanced</span>
              <p className="text-sm mt-2">Master the most challenging topics.</p>
          </Link>
        </div>
        
      </div>
    </div>
  )
}

export default Page

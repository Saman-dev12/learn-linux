'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';

function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
          True 
        </Link>
        <div className="flex flex-col md:flex-row items-center">
          {session?.user ? (
            <>
              <span className="mr-4 mb-2 md:mb-0">
                Welcome, {session.user.username || session.user.name || 'User'}
              </span>
              <button 
                onClick={() => signOut({callbackUrl:'/'})}  
                className="w-full md:w-auto bg-slate-100 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition ease-in-out duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login">
              <button className="w-full md:w-auto bg-slate-100 text-black font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-75 transition ease-in-out duration-150">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
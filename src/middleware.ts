import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXTAUTH_SECRET; // Add your secret here

export async function middleware(req: NextRequest) {
    // Define your URL patterns
    const { pathname } = req.nextUrl;

    // Get the token from the request
    const token = await getToken({ req, secret });

    // Handle redirection logic
    if (pathname === '/login' && token) {
        // Redirect authenticated users from /login to /dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (pathname === '/' && token) {
        // Redirect authenticated users from /login to /dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (pathname === '/dashboard' && !token) {
        // Redirect unauthenticated users from /dashboard to /login
        return NextResponse.redirect(new URL('/login', req.url));
    }

    // Allow access to other routes without redirection
    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/login', '/register'],
};

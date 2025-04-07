// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware executed!', request.nextUrl.pathname);

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';

  // Get the session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  console.log('Path:', path);
  console.log('Is public path:', isPublicPath);
  console.log('Session cookie exists:', !!sessionCookie);

  // Check if the user is authenticated
  const isAuthenticated = sessionCookie !== undefined;

  // If the path requires authentication and the user isn't authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    console.log('Redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If the user is on the login page but already authenticated, redirect to home
  if (isPublicPath && isAuthenticated) {
    console.log('Redirecting to home');
    return NextResponse.redirect(new URL('/', request.url));
  }

  console.log('Proceeding to next middleware/page');
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ['/', '/capacity', '/statistics', '/configure', '/login'],
};
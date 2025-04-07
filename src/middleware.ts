// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Define public paths that don't require authentication
  const isPublicPath = path === '/login';
  
  // Get the session cookie
  const sessionCookie = request.cookies.get('session')?.value;
  
  // Check if the user is authenticated
  const isAuthenticated = sessionCookie !== undefined;

  // If the path requires authentication and the user isn't authenticated, redirect to login
  if (!isPublicPath && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // If the user is on the login page but already authenticated, redirect to home
  if (isPublicPath && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: ['/', '/capacity', '/statistics', '/configure', '/login'],
};
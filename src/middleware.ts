import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that should be protected (require authentication)
const protectedPaths = [
  '/profile',
  '/admin',
  // Add more protected paths here
];

// Add paths that should be accessible only to non-authenticated users
const authPaths = [
  '/login',
  '/signup',
  '/forgot-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.has('auth-token'); // Firebase sets this cookie

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Redirect unauthenticated users to login
  if (!isAuthenticated && protectedPaths.some(path => pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 
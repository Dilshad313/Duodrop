// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { CUSTOMER_TOKEN_COOKIE } from '../lib/auth-utils.server';

// Protected routes
const protectedRoutes = ['/account'];
const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get(CUSTOMER_TOKEN_COOKIE)?.value;
  const isLoggedIn = !!token;

  // Check if path is protected
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // Redirect if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect if accessing auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/account', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/account/:path*', '/login', '/register'],
};
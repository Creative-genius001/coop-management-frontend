import { NextRequest, NextResponse } from 'next/server';

function getToken(req: NextRequest) {
  return req.cookies.get('token')?.value;
}

export async function middleware(req: NextRequest) {
  const token = getToken(req);
  const pathname = req.nextUrl.pathname;
  const role = 'admin'; // Default role

  if (pathname.startsWith('/api/auth') || pathname === '/login' || pathname === '/signup') {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', req.url));
  } else {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
}

export const config = {
  matcher: [
    '/:path*', 
    '/admin/:path*',     
    '/api/protected/:path*', 
  ],
};
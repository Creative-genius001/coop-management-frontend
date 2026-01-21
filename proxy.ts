import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';

function getToken(req: NextRequest) {
  return req.cookies.get('token')?.value;
}

function isPublicRoute(pathname: string) {
  return (
    pathname.startsWith("/auth") ||
    pathname === "/login" ||
    pathname === "/signup"
  )
}

export async function proxy(req: NextRequest) {
  
  const token = getToken(req);
  const { pathname } = req.nextUrl;
  console.log('Middleware token:', token);

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  };

  if (!token) {
    return NextResponse.redirect(new URL('/auth/login', req.url));
  }
  
  
  try {
      const payload = decodeJwt(token); 
      console.log(payload);
      
      const role = payload.role; 
      
      if (pathname.startsWith('/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    } 
      } catch (error) {
        console.error("Invalid token format", error);
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)', 
  ],
};
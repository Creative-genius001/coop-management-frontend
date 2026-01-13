import { NextResponse } from 'next/server';

export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/dashboard') && !request.cookies.has('authToken')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// import { NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

// export async function middleware(req) {
//   const token = await getToken({ req });
//   const { pathname } = req.nextUrl;

//   if (pathname.startsWith('/admin') && token?.role !== 'admin') {
//     return NextResponse.redirect(new URL('/dashboard', req.url)); // Or /unauthorized
//   }
//   if (pathname.startsWith('/dashboard') && !token) {
//     return NextResponse.redirect(new URL('/login', req.url));
//   }
//   return NextResponse.next();
// }

// export const config = { matcher: ['/admin/:path*', '/dashboard/:path*'] };
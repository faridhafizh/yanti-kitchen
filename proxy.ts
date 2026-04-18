import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth-token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login') || request.nextUrl.pathname.startsWith('/admin/register');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPage && !isAuthPage && !authToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAuthPage && authToken) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

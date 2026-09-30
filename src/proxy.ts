import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { verifySessionToken, COOKIE_NAME } from '@/lib/auth';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    if (pathname === '/admin/login' || pathname === '/admin/setup') return NextResponse.next();

    const token = request.cookies.get(COOKIE_NAME)?.value;
    const ok = token ? await verifySessionToken(token) : false;

    if (!ok) {
      // API หลังบ้านตอบ 401 (ไม่ redirect) — ไม่งั้นข้อมูลการเงิน/ตั้งค่า เรียกได้โดยไม่ต้องล็อกอิน
      if (pathname.startsWith('/api/')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/((?!api|admin|booking|doc|_next|_vercel|.*\\..*).*)',
  ],
};

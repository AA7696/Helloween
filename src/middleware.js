import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || 'supersecretkeyforhellenergyclone'
);

// Server-side route guards (run on the Edge before the page renders):
//  - /admin                  → requires a valid ADMIN token
//  - /cart, /checkout, /orders → requires any valid (logged-in) token
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('hw_token')?.value;

  let role = null;
  let valid = false;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secret);
      role = payload.role;
      valid = true;
    } catch {
      valid = false;
    }
  }

  const needsAdmin = pathname.startsWith('/admin');
  const allowed = needsAdmin ? role === 'admin' : valid;

  if (!allowed) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `?redirect=${pathname}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin', '/admin/:path*',
    '/cart', '/cart/:path*',
    '/checkout', '/checkout/:path*',
    '/orders', '/orders/:path*',
  ],
};

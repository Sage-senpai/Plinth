import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * The workspace holds other people's property documents, so it is gated.
 *
 * Demo mode is the exception: there is nothing behind the door but the seeded
 * records, and requiring a login to look at a demo would cost us the pilot
 * customers we are trying to win.
 */
export async function middleware(request: NextRequest) {
  if (process.env.DEMO_MODE !== 'false') return NextResponse.next();

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET ?? 'plinth-development-secret',
  });

  if (token) return NextResponse.next();

  const signIn = new URL('/signin', request.url);
  signIn.searchParams.set('from', request.nextUrl.pathname);
  return NextResponse.redirect(signIn);
}

export const config = {
  matcher: ['/workspace/:path*'],
};

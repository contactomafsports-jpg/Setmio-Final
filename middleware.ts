import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Public, static, and API routes should never be rewritten.
    if (
      pathname.startsWith('/club') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    const currentHost = hostname
      .replace('.setmiofinal2.vercel.app', '')
      .replace('.setmiofinal.vercel.app', '')
      .replace('.localhost:3000', '')
      .replace('localhost:3000', '')

    if (
      currentHost &&
      currentHost !== hostname &&
      !currentHost.includes(':') &&
      currentHost !== 'setmiofinal2' &&
      currentHost !== 'setmiofinal'
    ) {
      return NextResponse.rewrite(
        new URL(`/club/${currentHost}${pathname}`, request.url),
      )
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

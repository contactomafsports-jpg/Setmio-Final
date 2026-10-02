import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl
    const hostname = request.headers.get('host') || ''

    if (
      pathname.startsWith('/club') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/_next') ||
      pathname.includes('.')
    ) {
      return NextResponse.next()
    }

    if (
      hostname.includes('setmiofinal2.vercel.app') ||
      hostname.includes('setmiofinal.vercel.app') ||
      hostname.includes('localhost')
    ) {
      const subdomain = hostname
        .replace('.setmiofinal2.vercel.app', '')
        .replace('.setmiofinal.vercel.app', '')
        .replace('.localhost:3000', '')
        .replace('localhost:3000', '')

      if (
        subdomain &&
        subdomain !== hostname &&
        subdomain !== 'setmiofinal2' &&
        subdomain !== 'setmiofinal'
      ) {
        return NextResponse.rewrite(
          new URL(`/club/${subdomain}${pathname}`, request.url),
        )
      }

      return NextResponse.next()
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}

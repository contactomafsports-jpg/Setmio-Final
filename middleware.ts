// ==============================================================================
// SETMIO PADEL PRO — VERCEL / NEXT.JS MULTI-TENANT EDGE MIDDLEWARE
// Enrutamiento dinámico por Dominios, Subdominios y Rutas Personalizadas
// Dominio Base: setmiofinal2.vercel.app | Local: localhost:3000
// ==============================================================================

import { NextResponse } from 'next/server';

export interface NextRequestLike {
  url: string;
  nextUrl?: {
    pathname: string;
    search: string;
    clone: () => any;
  };
  headers: {
    get: (key: string) => string | null;
  };
}

// Mapa estático de dominios personalizados conocidos para evitar consultas en Edge.
const KNOWN_CLUBS_BY_CUSTOM_DOMAIN: Record<string, string> = {
  'padelsanmateo.com': 'sanmateo',
  'www.padelsanmateo.com': 'sanmateo',
  'padelsanmateo.es': 'sanmateo',
  'www.padelsanmateo.es': 'sanmateo',
  'padelcoruna.es': 'padelcoruna',
  'martinsanchezpadel.com': 'martinsanchez',
};

export function middleware(request: any) {
  try {
    const host = request.headers.get('host') || '';
    const cleanHost = host.toLowerCase().split(':')[0];
    const url = new URL(request.url);
    const pathname = url.pathname;

    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/api/') ||
      pathname.startsWith('/assets/') ||
      pathname.includes('.')
    ) {
      return NextResponse.next();
    }

    const isRootHost =
      cleanHost === '' ||
      cleanHost === 'localhost' ||
      cleanHost === '127.0.0.1' ||
      cleanHost === 'setmiofinal.vercel.app' ||
      cleanHost === 'setmiofinal2.vercel.app' ||
      cleanHost.endsWith('.run.app');

    if (isRootHost) {
      return NextResponse.next();
    }

    let subdomain = '';
    if (cleanHost.endsWith('.setmiofinal2.vercel.app')) {
      subdomain = cleanHost.replace('.setmiofinal2.vercel.app', '');
    } else if (cleanHost.endsWith('.localhost')) {
      subdomain = cleanHost.replace('.localhost', '');
    }

    if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
      url.pathname = `/club/${subdomain}${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }

    const clubSlug = KNOWN_CLUBS_BY_CUSTOM_DOMAIN[cleanHost];
    if (clubSlug) {
      url.pathname = `/club/${clubSlug}${pathname === '/' ? '' : pathname}`;
      return NextResponse.rewrite(url);
    }

    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon.svg
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

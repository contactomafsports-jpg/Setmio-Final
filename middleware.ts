// ==============================================================================
// SETMIO PADEL PRO — VERCEL / NEXT.JS MULTI-TENANT EDGE MIDDLEWARE
// Enrutamiento dinámico por Dominios, Subdominios y Rutas Personalizadas
// Dominio Base: setmiofinal2.vercel.app | Local: localhost:3000
// ==============================================================================

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

// Mapa estático de reserva rápida para respuesta instantánea en edge sin latencia de red
const KNOWN_CLUBS_BY_CUSTOM_DOMAIN: Record<string, string> = {
  'padelsanmateo.com': 'sanmateo',
  'www.padelsanmateo.com': 'sanmateo',
  'padelsanmateo.es': 'sanmateo',
  'www.padelsanmateo.es': 'sanmateo',
  'padelcoruna.es': 'padelcoruna',
  'martinsanchezpadel.com': 'martinsanchez',
};

export async function middleware(request: any) {
  const url = new URL(request.url);
  const hostname = (request.headers?.get?.('host') || url.hostname || '').toLowerCase();
  const cleanHost = hostname.split(':')[0]; // Eliminar puerto si existe (:3000)
  const pathname = url.pathname;

  // 1. Omitir archivos estáticos, api y assets de compilación
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    pathname.includes('.') // Archivos con extensión (.svg, .png, .ico, .js, .css, etc.)
  ) {
    return;
  }

  // 2. Verificar si es el dominio corporativo raíz o localhost estándar
  const isRootCorporateDomain =
    cleanHost === 'setmiofinal2.vercel.app' ||
    cleanHost === 'localhost' ||
    cleanHost === '127.0.0.1' ||
    cleanHost.endsWith('.run.app'); // AI Studio cloud run preview

  if (isRootCorporateDomain) {
    // Si la ruta ya especifica directamente /club/[slug], Next.js / Vite la procesa
    // Si es '/', sirve la Landing Corporativa de Setmio
    return;
  }

  // 3. Verificar si es un subdominio de setmiofinal2.vercel.app (ej: sanmateo.setmiofinal2.vercel.app)
  if (cleanHost.endsWith('.setmiofinal2.vercel.app')) {
    const subdomain = cleanHost.replace('.setmiofinal2.vercel.app', '');
    if (subdomain && subdomain !== 'www' && subdomain !== 'app') {
      // Reescribir internamente a /club/[subdomain] manteniendo la URL en la barra del navegador
      url.pathname = `/club/${subdomain}${pathname === '/' ? '' : pathname}`;
      return (globalThis as any).NextResponse?.rewrite(url);
    }
  }

  // 4. Verificar si es un subdominio en entorno de desarrollo local (ej: sanmateo.localhost:3000)
  if (cleanHost.endsWith('.localhost')) {
    const subdomain = cleanHost.replace('.localhost', '');
    if (subdomain && subdomain !== 'www') {
      url.pathname = `/club/${subdomain}${pathname === '/' ? '' : pathname}`;
      return (globalThis as any).NextResponse?.rewrite(url);
    }
  }

  // 5. Dominio Personalizado de Cliente (ej: padelsanmateo.com)
  // Consultar en mapa estático rápido o base de datos Supabase
  let clubSlug = KNOWN_CLUBS_BY_CUSTOM_DOMAIN[cleanHost];

  if (!clubSlug) {
    try {
      const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const queryUrl = `${supabaseUrl}/rest/v1/clubs?custom_domain=eq.${cleanHost}&select=slug&limit=1`;
        const res = await fetch(queryUrl, {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data[0]?.slug) {
            clubSlug = data[0].slug;
          }
        }
      }
    } catch {
      // Continuar con fallback
    }
  }

  // Si se encontró el club por dominio personalizado, reescribir internamente a /club/[slug]
  if (clubSlug) {
    url.pathname = `/club/${clubSlug}${pathname === '/' ? '' : pathname}`;
    return (globalThis as any).NextResponse?.rewrite(url);
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
    '/((?!api|_next/static|_next/image|assets|favicon.ico|icon.svg|manifest.webmanifest).*)',
  ],
};

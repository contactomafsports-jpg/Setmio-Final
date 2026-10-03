import { NextResponse, type NextRequest } from "next/server"

/**
 * Root middleware entrypoint required by Next.js/Vercel.
 *
 * Keep this function exported from the root so the deployment runtime can
 * discover it. Supabase session refresh can be delegated here once the SSR
 * client is configured; for now requests continue safely without mutation.
 */
export function middleware(request: NextRequest) {
  return NextResponse.next({ request })
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

export default middleware

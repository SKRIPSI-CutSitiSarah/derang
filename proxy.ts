import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)

  const { pathname } = request.nextUrl
  const isLoginPage = pathname.startsWith('/login')
  const isRegisterPage = pathname.startsWith('/register')
  const isLandingPage = pathname === '/'
  // Public pages accessible without authentication: landing, login, register.
  const isPublicPage = isLandingPage || isLoginPage || isRegisterPage

  // If user is not authenticated and trying to access a protected page, redirect to login
  if (!user && !isPublicPage) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is authenticated and trying to access login or register, redirect to dashboard
  if (user && (isLoginPage || isRegisterPage)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api (route handlers — these are not pages, so they should not be
     *   redirected to /login; server-to-server calls like the ML client
     *   fetching the mock ML routes don't carry the browser's session
     *   cookies. Route handlers that need auth should check it themselves.)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

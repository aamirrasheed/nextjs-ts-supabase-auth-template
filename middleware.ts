import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { createClient } from '@/utils/supabase/server'
export async function middleware(request: NextRequest) {
  /* this call is necessary to refresh the auth token, pass it to server components and to the browser */
  await updateSession(request)

  const protectFromAuthorized = ['/signup', '/login']
  const protectFromUnauthorized = ['/dashboard']

  const supabase = createClient()
  const { data} = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  if(protectFromAuthorized.includes(pathname) && data?.user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if(protectFromUnauthorized.includes(pathname) && !data?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/signup', '/login', // protect from authorized
    '/dashboard', // protect from unauthorized
  ],
}
import { IDTokenCookieName } from '@/lib/cookie'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    const idToken = req.cookies.get(IDTokenCookieName)?.value
    if (!idToken) {
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

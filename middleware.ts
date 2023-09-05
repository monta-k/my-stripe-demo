import { IDTokenCookieName } from '@/lib/cookie'
import { NextResponse, type NextRequest } from 'next/server'
import { relativeFetch } from './lib/fetch'

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/login')) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    const idToken = req.cookies.get(IDTokenCookieName)?.value
    if (!idToken) {
      return NextResponse.redirect(redirectUrl)
    }
    try {
      const res = await relativeFetch('/api/me', { headers: { authorization: `Bearer ${idToken}` } })
      if (res.status >= 400) throw new Error('Unauthorized')
    } catch (e) {
      return NextResponse.redirect(redirectUrl)
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}

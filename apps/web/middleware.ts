import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '')

    const { pathname } = request.nextUrl

    // 1. Define Route Types
    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
    const isPublicPage = pathname === '/'
    const isProtectedPage = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/profile') ||
        pathname.startsWith('/colleges') ||
        pathname.startsWith('/clubs') ||
        pathname.startsWith('/events') ||
        pathname.startsWith('/marketplace') ||
        pathname.startsWith('/notes') ||
        pathname.startsWith('/messages')

    // 2. Redirect to login if accessing protected page without token
    if (isProtectedPage && !token) {
        const url = new URL('/login', request.url)
        url.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(url)
    }

    // 3. Redirect to dashboard if accessing auth/public pages with token
    if ((isAuthPage || pathname === '/') && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // 4. College Hub Protection (Basic check, full check needs user profile in AuthContext/Server Component)
    // We can't easily check user profile here without decoding JWT or making API call.
    // For now, we rely on the Server Component Guard or Client AuthContext to redirect if no collegeId.

    return NextResponse.next()
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - doodles (public assets)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|doodles).*)',
    ],
}

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/colleges",
    "/marketplace",
    "/notes",
    "/messages",
    "/profile",
    "/feed", // If we have a separate feed page
  ];

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // If it's a protected route and no token exists, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    // Optional: Add ?from=... to redirect back after login
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|doodles).*)",
  ],
};

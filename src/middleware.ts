import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Define protected and public routes
const protectedRoutes = ["/dashboard", "/api/user", "/api/message"];
const publicRoutes = ["/", "/signin", "/signup", "/verify"];

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};

export async function middleware(request: NextRequest) {
  try {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // Check if the route is protected
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isPublicRoute = publicRoutes.some(
      (route) => pathname === route || pathname.startsWith(route)
    );

    // If user is authenticated and tries to access public routes
    if (token && isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If user is not authenticated and tries to access protected routes
    if (!token && isProtectedRoute) {
      const signinUrl = new URL("/signin", request.url);
      signinUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signinUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/signin", request.url));
  }
}

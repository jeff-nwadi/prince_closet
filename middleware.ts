import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the existence of Better Auth session token cookies (standard and secure versions)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboardPage = pathname.startsWith("/dashboard");

  // If the user has a session cookie and is attempting to access login/signup, redirect to shop
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/shop", request.url));
  }

  // If the user does NOT have a session and is trying to access dashboard, redirect to login
  if (!sessionToken && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to auth and dashboard pages
export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*"],
};

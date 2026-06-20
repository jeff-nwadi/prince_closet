import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the existence of Better Auth session token cookies (standard and secure versions)
  const sessionToken =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/signup");
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login");
  const isAdminLoginPage = pathname === "/admin/login";

  // ── Standard storefront auth ──────────────────────────────────────────────
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/shop", request.url));
  }
  if (!sessionToken && isDashboardPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ── Admin auth ────────────────────────────────────────────────────────────
  if (isAdminPage) {
    // No session at all → admin login
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Validate session and check admin role server-side
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      if (!session?.user) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }

      const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (!adminEmails.includes(session.user.email.toLowerCase())) {
        // Authenticated but not an admin
        return new NextResponse("Forbidden", { status: 403 });
      }
    } catch {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // Redirect logged-in admins away from admin login page
  if (isAdminLoginPage && sessionToken) {
    try {
      const session = await auth.api.getSession({ headers: request.headers });
      const adminEmails = (process.env.ADMIN_EMAILS ?? "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      if (session?.user && adminEmails.includes(session.user.email.toLowerCase())) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    } catch {
      // fall through to login page
    }
  }

  return NextResponse.next();
}

// Apply middleware to auth, dashboard, and admin pages
export const config = {
  matcher: ["/login", "/signup", "/dashboard/:path*", "/admin/:path*"],
};

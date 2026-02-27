import { NextRequest, NextResponse } from "next/server";

// Routes accessible without authentication
const publicRoutes = ["/", "/login", "/register", "/approve"];

// Routes that require authentication
const protectedPrefixes = [
  "/dashboard",
  "/pipeline",
  "/projects",
  "/clients",
  "/approvals",
  "/ai",
  "/admin",
  "/settings",
];

export function middleware(request: NextRequest) {
  // Check all possible session cookie names (Secure prefix for HTTPS, plain for HTTP dev)
  const sessionCookie =
    request.cookies.get("__Secure-neon-auth.session_token") ||
    request.cookies.get("neon-auth.session_token") ||
    request.cookies.get("better-auth.session_token");
  const { pathname } = request.nextUrl;

  // Normalize 127.0.0.1 origin to localhost for Neon Auth compatibility
  if (pathname.startsWith("/api/auth")) {
    const origin = request.headers.get("origin") || "";
    if (origin.includes("127.0.0.1")) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("origin", origin.replace("127.0.0.1", "localhost"));
      return NextResponse.next({ request: { headers: requestHeaders } });
    }
    return NextResponse.next();
  }

  // Redirect logged-in users away from auth pages
  if (sessionCookie && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect internal routes — redirect to login if not authenticated
  const isProtected = protectedPrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );
  if (isProtected && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|videos).*)",
  ],
};

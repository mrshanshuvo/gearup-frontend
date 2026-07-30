import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple JWT parser for edge environment without node dependencies
function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthPage =
    pathname.startsWith("/auth/login") || pathname.startsWith("/auth/register");
  const isDashboardPage = pathname.startsWith("/dashboard");

  let userRole: string | null = null;
  if (token) {
    const payload = decodeJwtPayload(token);
    if (payload && payload.role) {
      userRole = payload.role;
    }
  }

  // Redirect authenticated users away from auth pages to their dashboard
  if (isAuthPage && token && userRole) {
    let redirectPath = "/dashboard/customer";
    if (userRole === "Admin") redirectPath = "/dashboard/admin";
    if (userRole === "Provider") redirectPath = "/dashboard/provider";
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  // Protect Dashboard Routes
  if (isDashboardPage) {
    if (!token || !userRole) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Path Access Control
    if (pathname.startsWith("/dashboard/admin") && userRole !== "Admin") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/dashboard/provider") && userRole !== "Provider") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (pathname.startsWith("/dashboard/customer") && userRole !== "Customer") {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};

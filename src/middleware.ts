import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";
import { MANAGER_ONLY_PATHS, ROLE } from "@/constants/route-authorization";

function hasRole(tokenRoles: string[], expected: string): boolean {
  return tokenRoles.some((role) => role.toLowerCase() === expected.toLowerCase());
}

function isLocalhost(request: Request) {
  return ["localhost", "127.0.0.1", "[::1]"].includes(request.nextUrl.hostname);
}

const authMiddleware = withAuth(
  (request) => {
    const token = request.nextauth.token;
    const pathname = request.nextUrl.pathname;
    const tokenRoles = ((token?.userRoles as string[] | undefined) ?? []).map((role) => role.toLowerCase());

    const isManagerRoute = MANAGER_ONLY_PATHS.some((path) => pathname === path || pathname.startsWith(`${path}/`));
    if (isManagerRoute && !hasRole(tokenRoles, ROLE.manager)) {
      const fallback = new URL("/", request.url);
      return NextResponse.redirect(fallback);
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      // Require authenticated session for protected routes.
      authorized: ({ token }) => !!token,
    },
  },
);

export default function middleware(request: any, event: any) {
  if (isLocalhost(request)) {
    return NextResponse.next();
  }
  return authMiddleware(request, event);
}

export const config = {
  matcher: [
    // Protect all app routes while excluding auth and static assets.
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

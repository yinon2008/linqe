import { NextResponse, type NextRequest } from "next/server";

// Auth protection is handled client-side in each protected page.
// This middleware is a passthrough until server-side auth is configured.
export function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

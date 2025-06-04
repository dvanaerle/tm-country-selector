import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  try {
    const preferredStoreCookie = request.cookies.get("preferredStore")?.value;

    if (preferredStoreCookie) {
      // Validate URL format before redirecting
      try {
        new URL(preferredStoreCookie);
        return NextResponse.redirect(preferredStoreCookie);
      } catch {
        // Invalid URL in cookie, clear it and continue
        const response = NextResponse.next();
        response.cookies.delete("preferredStore");
        return response;
      }
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

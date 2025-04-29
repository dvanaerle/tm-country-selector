import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const preferredStoreCookie = request.cookies.get("preferredStore")?.value;
  if (preferredStoreCookie) {
    return NextResponse.redirect(preferredStoreCookie);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

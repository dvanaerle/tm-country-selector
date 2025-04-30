// Importing Next.js utilities for handling server-side requests and responses.
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function that intercepts incoming requests.
export function middleware(request: NextRequest) {
  // Attempt to retrieve the value of the "preferredStore" cookie from the request.
  const preferredStoreCookie = request.cookies.get("preferredStore")?.value;

  // If the "preferredStore" cookie exists, redirect the user to the stored URL.
  if (preferredStoreCookie) {
    return NextResponse.redirect(preferredStoreCookie);
  }

  // If the cookie does not exist, proceed with the request as usual.
  return NextResponse.next();
}

// Configuration object specifying that this middleware should only run for the root URL ("/").
export const config = {
  matcher: "/",
};

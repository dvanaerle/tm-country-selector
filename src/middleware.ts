import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest): NextResponse {
  try {
    // Haal de waarde van de 'preferredStore' cookie op.
    const preferredStoreUrl = request.cookies.get("preferredStore")?.value;

    if (preferredStoreUrl) {
      try {
        // Valideer dat de waarde in de cookie een geldige URL is voordat er wordt doorgestuurd.
        const url = new URL(preferredStoreUrl, request.nextUrl.origin);
        if (url.origin === request.nextUrl.origin) {
          // Stuur de gebruiker door naar de opgeslagen landselectie.
          return NextResponse.redirect(url);
        }
      } catch {
        // Als de URL ongeldig is, verwijder de corrupte cookie en ga verder.
        const response = NextResponse.next();
        response.cookies.delete("preferredStore");
        return response;
      }
    }
  } catch (error) {
    // Log eventuele onverwachte fouten in de middleware.
    console.error(error);
  }

  // Als er geen cookie is, of als er een fout is opgetreden, ga dan door met het normale verzoek.
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};

// Importing a utility to configure request-based internationalization (i18n) in Next.js.
import { getRequestConfig } from "next-intl/server";
// Importing a function to access HTTP headers in a Next.js server environment.
import { headers } from "next/headers";

// Exporting the configuration for handling internationalization based on the request.
export default getRequestConfig(async () => {
  // List of supported locales (languages) for the application.
  const locales = ["en", "de", "nl", "fr"];

  // Default locale to fall back to if no match is found.
  const defaultLocale = "en";

  // Variable to store the resolved locale, initialized to the default.
  let locale = defaultLocale;

  try {
    // Retrieve the "accept-language" header from the incoming request.
    const acceptLanguage = (await headers()).get("accept-language");

    if (acceptLanguage) {
      // Parse the "accept-language" header to extract language codes.
      const headerLanguages = acceptLanguage
        .split(",") // Split by commas to get individual language preferences.
        .map((part) => part.split(";")[0].trim().split("-")[0]); // Extract the primary language code.

      // Find the first language in the header that matches a supported locale.
      const matchedLocale = headerLanguages.find((lang) =>
        locales.includes(lang),
      );
      if (matchedLocale) {
        // If a match is found, update the locale.
        locale = matchedLocale;
      }
    }
  } catch (error) {
    // Silently handle any errors (e.g., missing headers or parsing issues).
  }

  // Return the resolved locale and its corresponding translation messages.
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default, // Dynamically import the translation file for the resolved locale.
  };
});

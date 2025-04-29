import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

const locales = ["en", "de", "nl", "fr"];
const defaultLocale = "en";

export default getRequestConfig(async () => {
  // Try to get locale from Accept-Language header
  const acceptLanguage = (await headers()).get("accept-language");
  let locale = defaultLocale;

  if (acceptLanguage) {
    // Extract language codes and find the first match
    const headerLanguages = acceptLanguage
      .split(",")
      .map((part) => part.split(";")[0].trim().split("-")[0]);

    const matchedLocale = headerLanguages.find((lang) =>
      locales.includes(lang),
    );
    if (matchedLocale) {
      locale = matchedLocale;
    }
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

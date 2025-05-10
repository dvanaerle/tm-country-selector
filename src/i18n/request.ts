import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

export default getRequestConfig(async () => {
  // Get the request headers
  const accept = (await headers()).get("accept-language") ?? "";

  // Define the supported locales and default locale
  const supported = ["en", "nl", "de", "fr"];
  const defaultLocale = "en";

  // Use Negotiator + formatjs-localematcher
  const languages = new Negotiator({
    headers: { "accept-language": accept },
  }).languages();
  const locale = match(languages, supported, defaultLocale);

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

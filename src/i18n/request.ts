import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";

export default getRequestConfig(async () => {
  // Haal de 'accept-language' header van het inkomende verzoek op.
  const acceptLanguageHeader = (await headers()).get("accept-language") ?? "";

  // Definieer de ondersteunde talen en de standaardtaal.
  const supportedLocales = ["en", "nl", "de", "fr"];
  const defaultLocale = "en";

  // Gebruik Negotiator om de door de browser gevraagde talen te parsen.
  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguageHeader },
  }).languages();

  // Gebruik @formatjs/intl-localematcher om de beste overeenkomst te vinden
  // tussen de gevraagde talen en de ondersteunde talen.
  const locale = match(languages, supportedLocales, defaultLocale);

  return {
    locale,
    // Laad dynamisch het JSON-bestand met vertalingen voor de geselecteerde taal.
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

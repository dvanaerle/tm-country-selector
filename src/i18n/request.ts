import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { z } from "zod";

const SupportedLocaleSchema = z.enum(["en", "nl", "de", "fr"]);
type SupportedLocale = z.infer<typeof SupportedLocaleSchema>;

const SUPPORTED_LOCALES = SupportedLocaleSchema.options;
const DEFAULT_LOCALE = SupportedLocaleSchema.parse("en");

type GetNegotiatedLocaleOptions = {
  acceptLanguage: string;
  supportedLocales: string[];
};

const getAcceptLanguageHeader = (headers: Headers): string => {
  return headers.get("accept-language") ?? "";
};

const getNegotiatedLocale = (
  options: GetNegotiatedLocaleOptions,
): SupportedLocale => {
  const { acceptLanguage, supportedLocales } = options;

  const languages = new Negotiator({
    headers: { "accept-language": acceptLanguage },
  }).languages();

  const matchedLocale = match(languages, supportedLocales, DEFAULT_LOCALE);
  const validationResult = SupportedLocaleSchema.safeParse(matchedLocale);

  return validationResult.success ? validationResult.data : DEFAULT_LOCALE;
};

export default getRequestConfig(async () => {
  const requestHeaders = await headers();
  const acceptLanguage = getAcceptLanguageHeader(requestHeaders);

  const locale = getNegotiatedLocale({
    acceptLanguage,
    supportedLocales: SUPPORTED_LOCALES,
  });

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});

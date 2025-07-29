import { z } from "zod";

export const STORE_COUNTRY_CODES = [
  "BE-NL",
  "BE-FR",
  "DE",
  "FR",
  "NL",
  "EN",
] as const;

export const StoreCountryCodeSchema = z.enum(STORE_COUNTRY_CODES);

export const StoreDataSchema = z.object({
  countryCode: StoreCountryCodeSchema,
  countryKey: z.string(),
  languageKey: z.string(),
  storeUrl: z.url(),
});

export type CountryCode = z.infer<typeof StoreCountryCodeSchema>;
export type StoreData = z.infer<typeof StoreDataSchema>;

const storesDataArray: StoreData[] = [
  {
    countryCode: "BE-NL",
    countryKey: "België",
    languageKey: "Nederlands",
    storeUrl: "https://www.tuinmaximaal.be/",
  },
  {
    countryCode: "BE-FR",
    countryKey: "Belgique",
    languageKey: "Français",
    storeUrl: "https://www.tuinmaximaal.be/fr/",
  },
  {
    countryCode: "DE",
    countryKey: "Deutschland",
    languageKey: "Deutsch",
    storeUrl: "https://www.tuinmaximaal.de/",
  },
  {
    countryCode: "FR",
    countryKey: "France",
    languageKey: "Français",
    storeUrl: "https://www.tuinmaximaal.fr/",
  },
  {
    countryCode: "NL",
    countryKey: "Nederland",
    languageKey: "Nederlands",
    storeUrl: "https://www.tuinmaximaal.nl/",
  },
  {
    countryCode: "EN",
    countryKey: "United Kingdom",
    languageKey: "English",
    storeUrl: "https://www.tuinmaximaal.co.uk/",
  },
];

export const STORES_DATA = z.array(StoreDataSchema).parse(storesDataArray);
